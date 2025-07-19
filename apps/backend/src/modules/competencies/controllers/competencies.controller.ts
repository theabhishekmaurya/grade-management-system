import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { CompetenciesService } from '../services/competencies.service';
import { CreateCompetencyDto } from '../dtos/create-competency.dto';
import { UpdateCompetencyDto } from '../dtos/update-competency.dto';
import { createSuccessResponse } from '../../../common/filters/global-exception.filter';

@Controller()
export class CompetenciesController {
  private readonly logger = new Logger(CompetenciesController.name);

  constructor(private readonly competenciesService: CompetenciesService) {}

  /**
   * Create a new competency under a subject
   * POST /subjects/:subjectId/competencies
   */
  @Post('subjects/:subjectId/competencies')
  @HttpCode(HttpStatus.CREATED)
  async createCompetency(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Body() createCompetencyDto: CreateCompetencyDto,
  ) {
    this.logger.log(
      `POST /subjects/${subjectId}/competencies - Creating competency: ${createCompetencyDto.name}`,
    );

    const competency = await this.competenciesService.createCompetency(
      subjectId,
      createCompetencyDto,
    );

    return createSuccessResponse(competency, 'Competency created successfully');
  }

  /**
   * Get all competencies for a specific subject
   * GET /subjects/:subjectId/competencies
   */
  @Get('subjects/:subjectId/competencies')
  @HttpCode(HttpStatus.OK)
  async getCompetenciesBySubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ) {
    this.logger.log(
      `GET /subjects/${subjectId}/competencies - Fetching competencies`,
    );

    const competencies =
      await this.competenciesService.getCompetenciesBySubject(subjectId);

    return createSuccessResponse(
      competencies,
      `Retrieved ${competencies.length} competencies successfully`,
    );
  }

  /**
   * Get competency by ID
   * GET /competencies/:id
   */
  @Get('competencies/:id')
  @HttpCode(HttpStatus.OK)
  async getCompetencyById(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`GET /competencies/${id} - Fetching competency by ID`);

    const competency = await this.competenciesService.getCompetencyById(id);

    return createSuccessResponse(
      competency,
      'Competency retrieved successfully',
    );
  }

  /**
   * Update competency
   * PATCH /competencies/:id
   */
  @Patch('competencies/:id')
  @HttpCode(HttpStatus.OK)
  async updateCompetency(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetencyDto: UpdateCompetencyDto,
  ) {
    this.logger.log(`PATCH /competencies/${id} - Updating competency`);

    const competency = await this.competenciesService.updateCompetency(
      id,
      updateCompetencyDto,
    );

    return createSuccessResponse(competency, 'Competency updated successfully');
  }

  /**
   * Delete competency
   * DELETE /competencies/:id
   */
  @Delete('competencies/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCompetency(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`DELETE /competencies/${id} - Deleting competency`);

    await this.competenciesService.deleteCompetency(id);

    return createSuccessResponse(null, 'Competency deleted successfully');
  }
}
