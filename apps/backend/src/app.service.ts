import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): {
    status: string;
    message: string;
    timestamp: string;
    database: string;
  } {
    return {
      status: 'OK',
      message: 'Service is running',
      timestamp: new Date().toISOString(),
      database: 'connected',
    };
  }
}
