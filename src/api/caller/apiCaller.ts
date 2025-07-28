import type { AxiosRequestConfig, AxiosError } from 'axios';

import axiosInstance from '@/api/instance/axiosInstance';
import type { ApiResponse } from '@/api/types/ApiResponse';
import { showApiErrorToast } from '@/modules/core/toasts/showApiErrorToast';

export class ApiError<T = any> extends Error {
  public statusCode?: number;
  public success: boolean;
  public errorData?: T;

  constructor(message: string, statusCode?: number, success: boolean = false, errorData?: T) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.success = success;
    this.errorData = errorData;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}


export const apiCaller = async <TResponseData>(
  config: AxiosRequestConfig,
): Promise<TResponseData> => {
  try {
    const response = await axiosInstance<ApiResponse<TResponseData>>(config);
    const apiResponse = response.data;

    if (apiResponse.success) {
      return apiResponse.data;
    } else {
      throw new ApiError<typeof apiResponse.data>(
        apiResponse.message || 'API request failed but marked as not successful.',
        response.status,
        false,
        apiResponse.data
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<any>>;

    if (axiosError.isAxiosError) {
      if (axiosError.response) {
        const errorResponseData = axiosError.response.data;
        
        const apiError = new ApiError(
          errorResponseData?.message || axiosError.message || 'An unknown API error occurred.',
          axiosError.response.status,
          errorResponseData?.success || false,
          errorResponseData?.data
        );
        showApiErrorToast(apiError);
        throw apiError;
      } else {
        throw new ApiError(
          axiosError.message || 'A network error occurred.',
          undefined,
          false
        );
      }
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      (error as Error).message || 'An unexpected error occurred.',
      undefined,
      false
    );
  }
};