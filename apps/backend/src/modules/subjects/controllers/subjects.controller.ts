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
import { SubjectsService } from '../services/subjects.service';
import { CreateSubjectDto } from '../dtos/create-subject.dto';
import { UpdateSubjectDto } from '../dtos/update-subject.dto';
import { createSuccessResponse } from '../../../common/filters/global-exception.filter';

@Controller('subjects')
export class SubjectsController {
  private readonly logger = new Logger(SubjectsController.name);

  constructor(private readonly subjectsService: SubjectsService) {}

  /**
   * Create a new subject
   * POST /subjects
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    this.logger.log(
      `POST /subjects - Creating subject: ${createSubjectDto.name}`,
    );

    const subject = await this.subjectsService.createSubject(createSubjectDto);

    return createSuccessResponse(subject, 'Subject created successfully');
  }

  /**
   * Get all subjects with their competencies
   * GET /subjects
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllSubjects() {
    this.logger.log('GET /subjects - Fetching all subjects');

    const subjects = await this.subjectsService.getAllSubjects();

    return createSuccessResponse(
      subjects,
      `Retrieved ${subjects.length} subjects successfully`,
    );
  }

  /**
   * Get subject by ID with competencies
   * GET /subjects/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSubjectById(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`GET /subjects/${id} - Fetching subject by ID`);

    const subject = await this.subjectsService.getSubjectById(id);

    return createSuccessResponse(subject, 'Subject retrieved successfully');
  }

  /**
   * Update subject
   * PATCH /subjects/:id
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    this.logger.log(`PATCH /subjects/${id} - Updating subject`);

    const subject = await this.subjectsService.updateSubject(
      id,
      updateSubjectDto,
    );

    return createSuccessResponse(subject, 'Subject updated successfully');
  }

  /**
   * Delete subject (cascades to competencies)
   * DELETE /subjects/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSubject(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`DELETE /subjects/${id} - Deleting subject`);

    await this.subjectsService.deleteSubject(id);

    return createSuccessResponse(
      null,
      'Subject and its competencies deleted successfully',
    );
  }
}
