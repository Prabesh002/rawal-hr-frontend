import axios from 'axios';

import { requestInterceptor, requestErrorInterceptor } from './requestInterceptor';
import { responseInterceptor, responseErrorInterceptor } from './responseInterceptor';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
axiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default axiosInstance;