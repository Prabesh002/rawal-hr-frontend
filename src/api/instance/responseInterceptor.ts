import type { AxiosError, AxiosResponse } from 'axios';

export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    console.error('Unauthorized request:', error.response);
  }

  return Promise.reject(error);
};