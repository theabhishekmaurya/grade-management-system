import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Database configuration for TypeORM with PostgreSQL
 * Reads configuration from environment variables with fallback defaults
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'db',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'grade_management',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in development only

  // Configure logging based on environment variables
  logging:
    process.env.DB_LOGGING === 'true'
      ? true
      : process.env.DB_LOGGING === 'all'
        ? true
        : process.env.DB_LOGGING === 'error'
          ? ['error', 'warn']
          : process.env.NODE_ENV === 'development'
            ? ['error', 'warn', 'schema']
            : false, // Default in prod: no logging

  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,

  // Connection retry configuration
  retryAttempts: 10,
  retryDelay: 3000,
  autoLoadEntities: true,

  // Connection timeout settings
  connectTimeoutMS: 60000,
  extra: {
    connectionTimeoutMillis: 60000,
    idleTimeoutMillis: 60000,
  },
};
