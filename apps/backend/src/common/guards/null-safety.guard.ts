import { BadRequestException } from '@nestjs/common';

/**
 * Null Safety Guard Utility Class
 * Provides comprehensive null/undefined checking to prevent runtime errors
 * Handles the "null pointer exceptions" mentioned in the PRD
 */
export class NullSafetyGuard {
  /**
   * Checks if a value is null or undefined
   * @param value - The value to check
   * @param fieldName - The name of the field for error messages
   * @throws BadRequestException if value is null/undefined
   */
  static requireNonNull<T>(value: T | null | undefined, fieldName: string): T {
    if (value === null || value === undefined) {
      throw new BadRequestException(`${fieldName} cannot be null or undefined`);
    }
    return value;
  }

  /**
   * Safely access nested properties without throwing null pointer errors
   * @param obj - The object to access
   * @param accessor - Function to access the property
   * @param defaultValue - Default value if access fails
   */
  static safeAccess<T, R>(
    obj: T | null | undefined,
    accessor: (obj: T) => R,
    defaultValue: R,
  ): R {
    try {
      if (obj === null || obj === undefined) {
        return defaultValue;
      }
      const result = accessor(obj);
      return result === null || result === undefined ? defaultValue : result;
    } catch (error) {
      return defaultValue;
    }
  }

  /**
   * Safely get array length or return 0
   * @param array - Array to check
   */
  static safeArrayLength<T>(array: T[] | null | undefined): number {
    return array?.length ?? 0;
  }

  /**
   * Safely get string length or return 0
   * @param str - String to check
   */
  static safeStringLength(str: string | null | undefined): number {
    return str?.length ?? 0;
  }

  /**
   * Check if string is null, undefined, or empty
   * @param str - String to check
   */
  static isNullOrEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Get safe string value with fallback
   * @param str - String to check
   * @param defaultValue - Default value if string is null/empty
   */
  static safeString(
    str: string | null | undefined,
    defaultValue: string = '',
  ): string {
    return str ?? defaultValue;
  }

  /**
   * Safely convert to number or return default
   * @param value - Value to convert
   * @param defaultValue - Default if conversion fails
   */
  static safeNumber(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Validate and clean input strings to prevent null pointer issues
   * @param input - Input string to validate
   * @param fieldName - Field name for error messages
   * @param maxLength - Maximum allowed length
   */
  static validateAndCleanString(
    input: string | null | undefined,
    fieldName: string,
    maxLength: number = 255,
  ): string {
    if (this.isNullOrEmpty(input)) {
      throw new BadRequestException(
        `${fieldName} is required and cannot be empty`,
      );
    }

    const cleanInput = input!.trim();

    if (cleanInput.length === 0) {
      throw new BadRequestException(`${fieldName} cannot be only whitespace`);
    }

    if (cleanInput.length > maxLength) {
      throw new BadRequestException(
        `${fieldName} cannot exceed ${maxLength} characters`,
      );
    }

    return cleanInput;
  }

  /**
   * Safely execute a function that might throw null pointer errors
   * @param fn - Function to execute
   * @param fallback - Fallback value if function fails
   * @param errorMessage - Custom error message
   */
  static safeExecute<T>(fn: () => T, fallback: T, errorMessage?: string): T {
    try {
      const result = fn();
      return result === null || result === undefined ? fallback : result;
    } catch (error) {
      if (errorMessage) {
        console.error(errorMessage, error);
      }
      return fallback;
    }
  }

  /**
   * Validate ID parameters to prevent null/undefined IDs
   * @param id - ID to validate
   * @param entityName - Name of the entity for error messages
   */
  static validateId(id: number | null | undefined, entityName: string): number {
    if (id === null || id === undefined || isNaN(id) || id <= 0) {
      throw new BadRequestException(
        `Valid ${entityName} ID is required. Received: ${id}`,
      );
    }
    return id;
  }
}
