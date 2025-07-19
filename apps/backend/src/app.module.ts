import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { allModules } from './modules/all-modules';

/**
 * Main application module
 * Configures TypeORM, database connection, and all application modules
 */
@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configure TypeORM with PostgreSQL
    TypeOrmModule.forRoot(databaseConfig),
    // Feature modules
    ...allModules,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global validation pipe for DTO validation
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true, // Remove properties that don't have decorators
          forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
          transform: true, // Transform payloads to be objects typed according to their DTO classes
          transformOptions: {
            enableImplicitConversion: true, // Convert string numbers to actual numbers
          },
        }),
    },
    // Global exception filter for consistent error responses
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
