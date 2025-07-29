import { AppRoute } from './types';
import { coreRoutes } from '@/modules/core/core.routes';
import { authRoutes } from '@/modules/auth/auth.routes';
import { hrRoutes } from '@/modules/hr/hr.routes';

export const appRoutes: AppRoute[] = [
  ...authRoutes,
  ...hrRoutes,
  ...coreRoutes,
];