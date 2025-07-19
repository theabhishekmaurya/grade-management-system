import { Repository } from 'typeorm';
import { Logger, BadRequestException } from '@nestjs/common';
import { Competency } from '../entities/competency.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { CreateCompetencyDto } from '../dtos/create-competency.dto';
import { UpdateCompetencyDto } from '../dtos/update-competency.dto';
import {
  CompetencyNotFoundException,
  CompetencyAlreadyExistsException,
  SubjectNotFoundException,
} from '../../../common/exceptions/custom.exceptions';
import { NullSafetyGuard } from '../../../common/guards/null-safety.guard';

/**
 * Utility functions for Competency operations
 * These functions are pure and focused on single responsibilities
 */
export class CompetencyUtils {
  /**
   * Validate and clean competency input data
   */
  static validateCompetencyInput(
    dto: CreateCompetencyDto | UpdateCompetencyDto,
    logger: Logger,
  ): { name?: string; marks?: number } {
    NullSafetyGuard.requireNonNull(dto, 'Competency DTO');

    const result: { name?: string; marks?: number } = {};

    if (dto.name !== undefined) {
      result.name = NullSafetyGuard.validateAndCleanString(
        dto.name,
        'Competency name',
        100,
      );
    }

    if (dto.marks !== undefined) {
      const safeMarks = NullSafetyGuard.safeNumber(dto.marks, 0);

      if (safeMarks < 0 || safeMarks > 10) {
        logger.warn(`Invalid marks value: ${safeMarks}`);
        throw new BadRequestException('Marks must be between 0 and 10');
      }

      result.marks = safeMarks;
    }

    logger.debug(`Validated competency input:`, result);
    return result;
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
    });

    if (!subject) {
      logger.warn(`Subject with ID ${validatedId} not found`);
      throw new SubjectNotFoundException(validatedId);
    }

    const subjectName = NullSafetyGuard.safeString(
      subject.name,
      'Unknown Subject',
    );
    logger.debug(`Found subject: ${subjectName}`);

    return subject;
  }

  /**
   * Find competency by ID or throw exception
   */
  static async findCompetencyByIdOrThrow(
    repository: Repository<Competency>,
    id: number,
    logger: Logger,
  ): Promise<Competency> {
    const validatedId = NullSafetyGuard.validateId(id, 'Competency');

    logger.debug(`Finding competency by ID: ${validatedId}`);

    const competency = await repository.findOne({
      where: { id: validatedId },
      relations: ['subject'],
    });

    if (!competency) {
      logger.warn(`Competency with ID ${validatedId} not found`);
      throw new CompetencyNotFoundException(validatedId);
    }

    // Ensure subject relation is properly loaded
    if (!competency.subject) {
      logger.error(`Competency ${validatedId} has null subject relation`);
      throw new Error('Competency subject relation is missing');
    }

    const competencyName = NullSafetyGuard.safeString(
      competency.name,
      'Unknown Competency',
    );
    logger.debug(`Found competency: ${competencyName}`);

    return competency;
  }

  /**
   * Find competency by name within a subject (returns null if not found)
   */
  static async findCompetencyByNameInSubject(
    repository: Repository<Competency>,
    name: string,
    subjectId: number,
    logger: Logger,
  ): Promise<Competency | null> {
    try {
      if (NullSafetyGuard.isNullOrEmpty(name)) {
        return null;
      }

      const validatedSubjectId = NullSafetyGuard.validateId(
        subjectId,
        'Subject',
      );
      const safeName = name.trim();

      logger.debug(
        `Finding competency by name: ${safeName} in subject: ${validatedSubjectId}`,
      );

      const competency = await repository.findOne({
        where: {
          name: safeName,
          subject: { id: validatedSubjectId },
        },
        relations: ['subject'],
      });

      return competency ?? null;
    } catch (error) {
      const errorMessage = NullSafetyGuard.safeString(
        error?.message,
        'Unknown error occurred while finding competency by name',
      );

      logger.error(
        `Failed to find competency by name: ${errorMessage}`,
        error?.stack,
      );
      return null;
    }
  }

  /**
   * Ensure competency name is unique within a subject
   */
  static async ensureUniqueCompetencyName(
    repository: Repository<Competency>,
    name: string,
    subjectId: number,
    subjectName: string,
    excludeId: number | null,
    logger: Logger,
  ): Promise<void> {
    const existingCompetency = await this.findCompetencyByNameInSubject(
      repository,
      name,
      subjectId,
      logger,
    );

    if (existingCompetency && existingCompetency.id !== excludeId) {
      logger.warn(
        `Attempt to create/update duplicate competency: ${name} in subject: ${subjectName}`,
      );
      throw new CompetencyAlreadyExistsException(name, subjectName);
    }

    logger.debug(
      `Competency name '${name}' is unique in subject '${subjectName}'`,
    );
  }

  /**
   * Validate and filter competencies array for null safety
   */
  static validateCompetenciesArray(
    competencies: Competency[],
    parentSubject: Subject,
    logger: Logger,
  ): Competency[] {
    const safeCompetencies = competencies ?? [];

    const validatedCompetencies = safeCompetencies.filter((competency) => {
      if (!competency) {
        logger.warn('Found null competency in results, filtering out');
        return false;
      }

      // Ensure subject relation is properly loaded
      if (!competency.subject) {
        logger.warn(
          `Competency ${competency.id} has null subject, setting to parent`,
        );
        competency.subject = parentSubject;
      }

      return true;
    });

    logger.debug(
      `Validated ${validatedCompetencies.length} competencies from ${safeCompetencies.length}`,
    );
    return validatedCompetencies;
  }

  /**
   * Create competency entity with validated data
   */
  static createCompetencyEntity(
    repository: Repository<Competency>,
    validatedData: { name: string; marks: number },
    subject: Subject,
    logger: Logger,
  ): Competency {
    logger.debug(
      `Creating competency entity: ${validatedData.name} with marks: ${validatedData.marks}`,
    );

    return repository.create({
      name: validatedData.name,
      marks: validatedData.marks,
      subject,
      subject_id: subject.id,
    });
  }

  /**
   * Save competency and validate result
   */
  static async saveCompetencySafely(
    repository: Repository<Competency>,
    competency: Competency,
    logger: Logger,
  ): Promise<Competency> {
    const savedCompetency = await repository.save(competency);

    NullSafetyGuard.requireNonNull(savedCompetency, 'savedCompetency');
    NullSafetyGuard.requireNonNull(savedCompetency.id, 'savedCompetency.id');

    const competencyName = NullSafetyGuard.safeString(
      savedCompetency.name,
      'Unknown Competency',
    );
    logger.debug(
      `Successfully saved competency: ${competencyName} with ID: ${savedCompetency.id}`,
    );

    return savedCompetency;
  }

  /**
   * Update competency fields safely
   */
  static updateCompetencyFields(
    competency: Competency,
    updateData: { name?: string; marks?: number },
    logger: Logger,
  ): void {
    if (updateData.name !== undefined) {
      competency.name = updateData.name;
      logger.debug(`Updated competency name to: ${updateData.name}`);
    }

    if (updateData.marks !== undefined) {
      competency.marks = updateData.marks;
      logger.debug(`Updated competency marks to: ${updateData.marks}`);
    }
  }

  /**
   * Remove competency safely
   */
  static async removeCompetencySafely(
    repository: Repository<Competency>,
    competency: Competency,
    logger: Logger,
  ): Promise<void> {
    NullSafetyGuard.requireNonNull(competency, 'competency');

    const competencyName = NullSafetyGuard.safeString(
      competency.name,
      'Unknown Competency',
    );

    await repository.remove(competency);

    logger.debug(`Successfully removed competency: ${competencyName}`);
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
