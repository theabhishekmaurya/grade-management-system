import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competency } from '../entities/competency.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { CreateCompetencyDto } from '../dtos/create-competency.dto';
import { UpdateCompetencyDto } from '../dtos/update-competency.dto';
import { CompetencyUtils } from './competency.utils';
import { NullSafetyGuard } from '../../../common/guards/null-safety.guard';

@Injectable()
export class CompetenciesService {
  private readonly logger = new Logger(CompetenciesService.name);

  constructor(
    @InjectRepository(Competency)
    private readonly competencyRepository: Repository<Competency>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {
    // Validate repository injections to prevent null pointer errors
    NullSafetyGuard.requireNonNull(
      this.competencyRepository,
      'competencyRepository',
    );
    NullSafetyGuard.requireNonNull(this.subjectRepository, 'subjectRepository');
  }

  /**
   * Create a new competency under a subject
   */
  async createCompetency(
    subjectId: number,
    createCompetencyDto: CreateCompetencyDto,
  ): Promise<Competency> {
    this.logger.log(
      `Creating new competency: ${createCompetencyDto.name} for subject ID: ${subjectId}`,
    );

    try {
      // Validate input data
      const validatedData = CompetencyUtils.validateCompetencyInput(
        createCompetencyDto,
        this.logger,
      );

      // Find and validate subject
      const subject = await CompetencyUtils.findSubjectByIdOrThrow(
        this.subjectRepository,
        subjectId,
        this.logger,
      );

      // Ensure competency name is unique within the subject
      await CompetencyUtils.ensureUniqueCompetencyName(
        this.competencyRepository,
        validatedData.name!,
        subjectId,
        subject.name,
        null,
        this.logger,
      );

      // Create and save competency
      const competency = CompetencyUtils.createCompetencyEntity(
        this.competencyRepository,
        validatedData as { name: string; marks: number },
        subject,
        this.logger,
      );

      const savedCompetency = await CompetencyUtils.saveCompetencySafely(
        this.competencyRepository,
        competency,
        this.logger,
      );

      this.logger.log(
        `Successfully created competency with ID: ${savedCompetency.id}`,
      );
      return savedCompetency;
    } catch (error) {
      return CompetencyUtils.handleServiceError(
        error,
        'create competency',
        this.logger,
      );
    }
  }

  /**
   * Get all competencies for a specific subject
   */
  async getCompetenciesBySubject(subjectId: number): Promise<Competency[]> {
    this.logger.log(`Fetching competencies for subject ID: ${subjectId}`);

    try {
      // Verify subject exists
      const subject = await CompetencyUtils.findSubjectByIdOrThrow(
        this.subjectRepository,
        subjectId,
        this.logger,
      );

      // Fetch competencies
      const competencies = await this.competencyRepository.find({
        where: { subject: { id: subjectId } },
        relations: ['subject'],
      });

      // Validate and clean results
      const validatedCompetencies = CompetencyUtils.validateCompetenciesArray(
        competencies,
        subject,
        this.logger,
      );

      this.logger.log(
        `Retrieved ${NullSafetyGuard.safeArrayLength(validatedCompetencies)} competencies for subject: ${subject.name}`,
      );
      return validatedCompetencies;
    } catch (error) {
      return CompetencyUtils.handleServiceError(
        error,
        'fetch competencies by subject',
        this.logger,
      );
    }
  }

  /**
   * Get competency by ID
   */
  async getCompetencyById(id: number): Promise<Competency> {
    this.logger.log(`Fetching competency with ID: ${id}`);

    try {
      const competency = await CompetencyUtils.findCompetencyByIdOrThrow(
        this.competencyRepository,
        id,
        this.logger,
      );

      this.logger.log(`Successfully retrieved competency: ${competency.name}`);
      return competency;
    } catch (error) {
      return CompetencyUtils.handleServiceError(
        error,
        'fetch competency by ID',
        this.logger,
      );
    }
  }

  /**
   * Update competency with validation
   */
  async updateCompetency(
    id: number,
    updateCompetencyDto: UpdateCompetencyDto,
  ): Promise<Competency> {
    this.logger.log(`Updating competency with ID: ${id}`);

    try {
      // Find existing competency
      const competency = await CompetencyUtils.findCompetencyByIdOrThrow(
        this.competencyRepository,
        id,
        this.logger,
      );

      // Validate input data
      const validatedData = CompetencyUtils.validateCompetencyInput(
        updateCompetencyDto,
        this.logger,
      );

      // Check name uniqueness if name is being updated
      if (validatedData.name && validatedData.name !== competency.name) {
        await CompetencyUtils.ensureUniqueCompetencyName(
          this.competencyRepository,
          validatedData.name,
          competency.subject.id,
          competency.subject.name,
          id,
          this.logger,
        );
      }

      // Update fields
      CompetencyUtils.updateCompetencyFields(
        competency,
        validatedData,
        this.logger,
      );

      // Save updated competency
      const updatedCompetency = await CompetencyUtils.saveCompetencySafely(
        this.competencyRepository,
        competency,
        this.logger,
      );

      this.logger.log(
        `Successfully updated competency: ${updatedCompetency.name}`,
      );
      return updatedCompetency;
    } catch (error) {
      return CompetencyUtils.handleServiceError(
        error,
        'update competency',
        this.logger,
      );
    }
  }

  /**
   * Delete competency
   */
  async deleteCompetency(id: number): Promise<void> {
    this.logger.log(`Deleting competency with ID: ${id}`);

    try {
      const competency = await CompetencyUtils.findCompetencyByIdOrThrow(
        this.competencyRepository,
        id,
        this.logger,
      );

      await CompetencyUtils.removeCompetencySafely(
        this.competencyRepository,
        competency,
        this.logger,
      );

      this.logger.log(`Successfully deleted competency: ${competency.name}`);
    } catch (error) {
      return CompetencyUtils.handleServiceError(
        error,
        'delete competency',
        this.logger,
      );
    }
  }
}
