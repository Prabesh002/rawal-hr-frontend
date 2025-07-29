import { AppRoute } from '@/router/types';
import DefaultLayout from '@/modules/core/components/layouts/DefaultLayout';
import EmployeeSetupPage from './employee-setup/pages/EmployeeSetupPage';
import { HR_PAGE_ROUTES } from './routes/hrRouteConstants';

export const hrRoutes: AppRoute[] = [
  {
    element: <DefaultLayout />,
    requiresAuth: true,
    children: [
      {
        path: HR_PAGE_ROUTES.EMPLOYEE_SETUP.substring(1),
        element: <EmployeeSetupPage />,
      }
    ]
  }
];