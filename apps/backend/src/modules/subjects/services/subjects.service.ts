import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { CreateSubjectDto } from '../dtos/create-subject.dto';
import { UpdateSubjectDto } from '../dtos/update-subject.dto';
import { SubjectUtils } from './subject.utils';
import { NullSafetyGuard } from '../../../common/guards/null-safety.guard';

@Injectable()
export class SubjectsService {
  private readonly logger = new Logger(SubjectsService.name);

  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {
    // Validate repository injection to prevent null pointer errors
    NullSafetyGuard.requireNonNull(this.subjectRepository, 'subjectRepository');
  }

  /**
   * Create a new subject with unique name validation
   */
  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    this.logger.log(`Creating new subject: ${createSubjectDto.name}`);

    try {
      // Validate and clean input
      const validatedData = SubjectUtils.validateSubjectInput(
        createSubjectDto,
        this.logger,
      );

      // Ensure name is unique
      await SubjectUtils.ensureUniqueSubjectName(
        this.subjectRepository,
        validatedData.name,
        null,
        this.logger,
      );

      // Create and save subject
      const subject = SubjectUtils.createSubjectEntity(
        this.subjectRepository,
        validatedData,
        this.logger,
      );
      const savedSubject = await SubjectUtils.saveSubjectSafely(
        this.subjectRepository,
        subject,
        this.logger,
      );

      this.logger.log(
        `Successfully created subject with ID: ${savedSubject.id}`,
      );

      // Fetch the newly created subject with its competencies
      const fetchedSubject = await this.getSubjectById(savedSubject.id);

      return fetchedSubject;
    } catch (error) {
      return SubjectUtils.handleServiceError(
        error,
        'create subject',
        this.logger,
      );
    }
  }

  /**
   * Get all subjects with their competencies
   */
  async getAllSubjects(): Promise<Subject[]> {
    this.logger.log('Fetching all subjects');

    try {
      const subjects = await this.subjectRepository.find({
        relations: {
          competencies: true,
        },
        order: {
          created_at: 'ASC',
          competencies: {
            created_at: 'ASC',
          },
        },
      });

      const validatedSubjects = SubjectUtils.validateSubjectsArray(
        subjects,
        this.logger,
      );

      this.logger.log(
        `Retrieved ${NullSafetyGuard.safeArrayLength(validatedSubjects)} subjects`,
      );
      return validatedSubjects;
    } catch (error) {
      return SubjectUtils.handleServiceError(
        error,
        'fetch all subjects',
        this.logger,
      );
    }
  }

  /**
   * Get subject by ID with competencies
   */
  async getSubjectById(id: number): Promise<Subject> {
    this.logger.log(`Fetching subject with ID: ${id}`);

    try {
      const subject = await SubjectUtils.findSubjectByIdOrThrow(
        this.subjectRepository,
        id,
        this.logger,
      );

      this.logger.log(`Successfully retrieved subject: ${subject.name}`);
      return subject;
    } catch (error) {
      return SubjectUtils.handleServiceError(
        error,
        'fetch subject by ID',
        this.logger,
      );
    }
  }

  /**
   * Update subject with validation
   */
  async updateSubject(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    this.logger.log(`Updating subject with ID: ${id}`);

    try {
      // Find existing subject
      const subject = await SubjectUtils.findSubjectByIdOrThrow(
        this.subjectRepository,
        id,
        this.logger,
      );

      // Validate input and check uniqueness if name is being updated
      if (updateSubjectDto.name) {
        const validatedData = SubjectUtils.validateSubjectInput(
          updateSubjectDto,
          this.logger,
        );

        await SubjectUtils.ensureUniqueSubjectName(
          this.subjectRepository,
          validatedData.name,
          id,
          this.logger,
        );
      }

      // Update fields
      SubjectUtils.updateSubjectFields(subject, updateSubjectDto, this.logger);

      // Save updated subject
      const updatedSubject = await SubjectUtils.saveSubjectSafely(
        this.subjectRepository,
        subject,
        this.logger,
      );

      this.logger.log(`Successfully updated subject: ${updatedSubject.name}`);
      return updatedSubject;
    } catch (error) {
      return SubjectUtils.handleServiceError(
        error,
        'update subject',
        this.logger,
      );
    }
  }

  /**
   * Delete subject (cascades to competencies)
   */
  async deleteSubject(id: number): Promise<void> {
    this.logger.log(`Deleting subject with ID: ${id}`);

    try {
      const subject = await SubjectUtils.findSubjectByIdOrThrow(
        this.subjectRepository,
        id,
        this.logger,
      );

      await SubjectUtils.removeSubjectSafely(
        this.subjectRepository,
        subject,
        this.logger,
      );

      this.logger.log(
        `Successfully deleted subject: ${subject.name} and its competencies`,
      );
    } catch (error) {
      return SubjectUtils.handleServiceError(
        error,
        'delete subject',
        this.logger,
      );
    }
  }
}
