export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T; // Optional, present only for successful responses
    errorDetails?: any; // Optional, present only for error responses
  }
  