import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competency } from './entities/competency.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { CompetenciesService } from './services/competencies.service';
import { CompetenciesController } from './controllers/competencies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Competency, Subject])],
  controllers: [CompetenciesController],
  providers: [CompetenciesService],
  exports: [CompetenciesService, TypeOrmModule],
})
export class CompetenciesModule {}
