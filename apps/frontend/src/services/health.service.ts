import api from './api';

export interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  database: string;
}

/**
 * API service class with all health-related endpoints
 */
export class HealthAPI {
  /**
   * Fetches the health status from the backend
   * @returns Promise with health status data
   */
  static async getHealthStatus(): Promise<HealthStatus> {
    try {
      const response: any = await api.get<HealthStatus>('/health');
      return response;
    } catch (error) {
      console.error('Failed to fetch health status:', error);
      throw new Error('Unable to connect to backend service');
    }
  }
}
