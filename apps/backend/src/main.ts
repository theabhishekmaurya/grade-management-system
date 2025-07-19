import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the Nest.js application
 * Configures CORS, global prefix, and starts the server
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3003',
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('', {
    exclude: ['health'], // Exclude health endpoint from prefix
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend server is running on: http://localhost:${port}`);
  console.log(`📊 Health check available at: http://localhost:${port}/health`);
}

bootstrap();
