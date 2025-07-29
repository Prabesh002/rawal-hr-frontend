import { AppRoute } from '@/router/types';
import DefaultLayout from '@/modules/core/components/layouts/DefaultLayout';
import EmployeeSetupPage from './employee-setup/pages/EmployeeSetupPage';
import { HR_PAGE_ROUTES } from './routes/hrRouteConstants';
import EmployeeListPage from './employee-management/pages/EmployeeListPage';
import EmployeeViewPage from './employee-management/pages/EmployeeViewPage';
import EmployeeEditPage from './employee-management/pages/EmployeeEditPage';


export const hrRoutes: AppRoute[] = [
  {
    element: <DefaultLayout />,
    requiresAuth: true,
    children: [
      {
        path: HR_PAGE_ROUTES.EMPLOYEE_SETUP.substring(1),
        element: <EmployeeSetupPage />,
      },
      {
        path: HR_PAGE_ROUTES.EMPLOYEES_LIST.substring(1),
        element: <EmployeeListPage />,
      },
      {
        path: HR_PAGE_ROUTES.EMPLOYEE_VIEW.substring(1),
        element: <EmployeeViewPage />,
      },
      {
        path: HR_PAGE_ROUTES.EMPLOYEE_EDIT.substring(1),
        element: <EmployeeEditPage />,
      }
    ]
  }
];