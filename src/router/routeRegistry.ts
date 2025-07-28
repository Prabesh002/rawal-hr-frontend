import { AppRoute } from './types';
import { coreRoutes } from '@/modules/core/core.routes';
import { authRoutes } from '@/modules/auth/auth.routes';

export const appRoutes: AppRoute[] = [
  ...authRoutes,
  ...coreRoutes,
];