'use client';

import { HealthAPI, HealthStatus } from '@/services/health.service';
import { useState, useEffect } from 'react';

/**
 * HealthCard component displays system health status
 * Demonstrates React hooks, async operations, and error handling
 */
export default function HealthCard() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches health status from the backend API
   * Handles loading states and error scenarios
   */
  const fetchHealthStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await HealthAPI.getHealthStatus();
      setHealthData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch health status on component mount
  useEffect(() => {
    fetchHealthStatus();
  }, []);

  /**
   * Returns appropriate status color based on health status
   */
  const getStatusColor = (status: string): string => {
    return status === 'OK'
      ? 'text-green-600 bg-green-100'
      : 'text-red-600 bg-red-100';
  };

  /**
   * Returns appropriate database status color
   */
  const getDatabaseColor = (database: string): string => {
    return database === 'connected'
      ? 'text-blue-600 bg-blue-100'
      : 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 width-full h-full mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">System Health</h2>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={fetchHealthStatus}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {healthData && !loading && (
        <div className="flex flex-col space-y-4 justify-between border border-gray-200 p-4 rounded-lg h-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(healthData.status)}`}
              >
                {healthData?.status?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getDatabaseColor(healthData.database)}`}
              >
                {healthData.database.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Message:</span>
              <span className="text-sm text-green-500 text-sm font-semibold">
                {healthData.message}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Check:</span>
              <span className="text-sm text-gray-500">
                {new Date(healthData.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div>
            <button
              onClick={fetchHealthStatus}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors cursor-pointer mb-1"
            >
              Refresh Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
