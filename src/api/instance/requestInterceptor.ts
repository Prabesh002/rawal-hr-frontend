import type { InternalAxiosRequestConfig } from 'axios';

import { getAppConfig } from '@/api/config/apiConfig';
import { AUTHORIZATION_HEADER_KEY, BEARER_PREFIX, JWT_LOCAL_STORAGE_KEY } from '@/api/constants';


export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const appConfig = getAppConfig();

  config.baseURL = appConfig.baseApiUrl;

  try {
    const token = localStorage.getItem(JWT_LOCAL_STORAGE_KEY);

    if (token) {
      config.headers[AUTHORIZATION_HEADER_KEY] = `${BEARER_PREFIX}${token}`;
    }
  } catch (e) {
    console.error('Error accessing localStorage for auth token:', e);
  }

  return config;
};

export const requestErrorInterceptor = (error: any) => {
  return Promise.reject(error);
};