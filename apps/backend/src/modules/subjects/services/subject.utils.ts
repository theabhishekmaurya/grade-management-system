import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Subject } from '../entities/subject.entity';
import { CreateSubjectDto } from '../dtos/create-subject.dto';
import { UpdateSubjectDto } from '../dtos/update-subject.dto';
import {
  SubjectNotFoundException,
  SubjectAlreadyExistsException,
} from '../../../common/exceptions/custom.exceptions';
import { NullSafetyGuard } from '../../../common/guards/null-safety.guard';

/**
 * Utility functions for Subject operations
 * These functions are pure and focused on single responsibilities
 */
export class SubjectUtils {
  /**
   * Validate and clean subject input data
   */
  static validateSubjectInput(
    dto: CreateSubjectDto | UpdateSubjectDto,
    logger: Logger,
  ): { name: string, description?:string } {
    NullSafetyGuard.requireNonNull(dto, 'Subject DTO');

    const safeName = NullSafetyGuard.validateAndCleanString(
      dto.name,
      'Subject name',
      100,
    );

    return { name: safeName, description: dto.description };
  }

  /**
   * Find subject by ID or throw exception
   */
  static async findSubjectByIdOrThrow(
    repository: Repository<Subject>,
    id: number,
    logger: Logger,
  ): Promise<Subject> {
    const validatedId = NullSafetyGuard.validateId(id, 'Subject');

    logger.debug(`Finding subject by ID: ${validatedId}`);

    const subject = await repository.findOne({
      where: { id: validatedId },
      relations: ['competencies'],
    });

    if (!subject) {
      logger.warn(`Subject with ID ${validatedId} not found`);
      throw new SubjectNotFoundException(validatedId);
    }

    // Ensure competencies array is never null
    if (!subject.competencies) {
      subject.competencies = [];
    }

    const subjectName = NullSafetyGuard.safeString(
      subject.name,
      'Unknown Subject',
    );
    logger.debug(`Found subject: ${subjectName}`);

    return subject;
  }

  /**
   * Find subject by name (returns null if not found)
   */
  static async findSubjectByName(
    repository: Repository<Subject>,
    name: string,
    logger: Logger,
  ): Promise<Subject | null> {
    try {
      if (NullSafetyGuard.isNullOrEmpty(name)) {
        return null;
      }

      const safeName = name.trim();
      logger.debug(`Finding subject by name: ${safeName}`);

      const subject = await repository.findOne({
        where: { name: safeName },
      });

      return subject ?? null;
    } catch (error) {
      const errorMessage = NullSafetyGuard.safeString(
        error?.message,
        'Unknown error occurred while finding subject by name',
      );

      logger.error(
        `Failed to find subject by name: ${errorMessage}`,
        error?.stack,
      );
      return null;
    }
  }

  /**
   * Ensure subject name is unique
   */
  static async ensureUniqueSubjectName(
    repository: Repository<Subject>,
    name: string,
    excludeId: number | null,
    logger: Logger,
  ): Promise<void> {
    const existingSubject = await this.findSubjectByName(
      repository,
      name,
      logger,
    );

    if (existingSubject && existingSubject.id !== excludeId) {
      logger.warn(`Attempt to create/update duplicate subject: ${name}`);
      throw new SubjectAlreadyExistsException(name);
    }

    logger.debug(`Subject name '${name}' is unique`);
  }

  /**
   * Validate and filter subjects array for null safety
   */
  static validateSubjectsArray(subjects: Subject[], logger: Logger): Subject[] {
    const safeSubjects = subjects ?? [];

    const validatedSubjects = safeSubjects.filter((subject) => {
      if (!subject) {
        logger.warn('Found null subject in results, filtering out');
        return false;
      }

      // Ensure competencies array is never null
      if (!subject.competencies) {
        subject.competencies = [];
      }

      return true;
    });

    logger.debug(
      `Validated ${validatedSubjects.length} subjects from ${safeSubjects.length}`,
    );
    return validatedSubjects;
  }

  /**
   * Create subject entity with validated data
   */
  static createSubjectEntity(
    repository: Repository<Subject>,
    validatedData: { name: string },
    logger: Logger,
  ): Subject {
    logger.debug(`Creating subject entity with name: ${validatedData.name}`);
    return repository.create(validatedData);
  }

  /**
   * Save subject and validate result
   */
  static async saveSubjectSafely(
    repository: Repository<Subject>,
    subject: Subject,
    logger: Logger,
  ): Promise<Subject> {
    const savedSubject = await repository.save(subject);

    NullSafetyGuard.requireNonNull(savedSubject, 'savedSubject');
    NullSafetyGuard.requireNonNull(savedSubject.id, 'savedSubject.id');

    const subjectName = NullSafetyGuard.safeString(
      savedSubject.name,
      'Unknown Subject',
    );
    logger.debug(
      `Successfully saved subject: ${subjectName} with ID: ${savedSubject.id}`,
    );

    return savedSubject;
  }

  /**
   * Update subject fields safely
   */
  static updateSubjectFields(
    subject: Subject,
    updateData: UpdateSubjectDto,
    logger: Logger,
  ): void {
    if (updateData.name) {
      const safeName = NullSafetyGuard.validateAndCleanString(
        updateData.name,
        'Subject name',
        100,
      );

      subject.name = safeName;
      logger.debug(`Updated subject name to: ${safeName}`);
    }

    if (updateData.description) {
      subject.description = updateData.description;
      logger.debug(`Updated subject description to: ${updateData.description}`);
    }
  }

  /**
   * Remove subject safely
   */
  static async removeSubjectSafely(
    repository: Repository<Subject>,
    subject: Subject,
    logger: Logger,
  ): Promise<void> {
    NullSafetyGuard.requireNonNull(subject, 'subject');

    const subjectName = NullSafetyGuard.safeString(
      subject.name,
      'Unknown Subject',
    );

    await repository.remove(subject);

    logger.debug(
      `Successfully removed subject: ${subjectName} and its competencies`,
    );
  }

  /**
   * Handle and log service errors consistently
   */
  static handleServiceError(
    error: any,
    operation: string,
    logger: Logger,
  ): never {
    const errorMessage = NullSafetyGuard.safeString(
      error?.message,
      `Unknown error occurred during ${operation}`,
    );

    logger.error(`Failed to ${operation}: ${errorMessage}`, error?.stack);
    throw error;
  }
}
