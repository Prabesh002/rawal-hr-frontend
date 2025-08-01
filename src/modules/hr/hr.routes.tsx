import { AppRoute } from '@/router/types';
import DefaultLayout from '@/modules/core/components/layouts/DefaultLayout';
import EmployeeSetupPage from './employee-setup/pages/EmployeeSetupPage';
import { HR_PAGE_ROUTES } from './routes/hrRouteConstants';
import EmployeeListPage from './employee-management/pages/EmployeeListPage';
import EmployeeViewPage from './employee-management/pages/EmployeeViewPage';
import EmployeeEditPage from './employee-management/pages/EmployeeEditPage';
import PayrollPage from './payroll-management/pages/PayrollPage';
import PayrollListPage from './payroll-management/pages/PayrollListPage';
import PayrollViewPage from './payroll-management/pages/PayrollViewPage';
import PayrollEditPage from './payroll-management/pages/PayrollEditPage';
import TimeClockPage from './time-management/pages/TimeClockPage';
import TimeLogListPage from './time-management/pages/TimeLogListPage';
import TimeLogViewPage from './time-management/pages/TimeLogViewPage';
import TimeLogEditPage from './time-management/pages/TimeLogEditPage';
import EmployeePayReportPage from './payroll-management/pages/EmployeePayReportPage';

export const hrRoutes: AppRoute[] = [
  {
    element: <DefaultLayout />,
    requiresAuth: true,
    children: [
      {
        path: HR_PAGE_ROUTES.EMPLOYEE_SETUP.substring(1),
        element: <EmployeeSetupPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.EMPLOYEES_LIST.substring(1),
        element: <EmployeeListPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.EMPLOYEE_VIEW.substring(1),
        element: <EmployeeViewPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.EMPLOYEE_EDIT.substring(1),
        element: <EmployeeEditPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.PAYROLL_CREATE.substring(1),
        element: <PayrollPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.PAYROLLS_LIST.substring(1),
        element: <PayrollListPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.PAYROLL_VIEW.substring(1),
        element: <PayrollViewPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.PAYROLL_EDIT.substring(1),
        element: <PayrollEditPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.TIME_CLOCK.substring(1),
        element: <TimeClockPage />,
      },
      {
        path: HR_PAGE_ROUTES.TIME_LOGS_LIST.substring(1),
        element: <TimeLogListPage />,
        requiresAdmin: false,
      },
      {
        path: HR_PAGE_ROUTES.TIME_LOG_VIEW.substring(1),
        element: <TimeLogViewPage />,
        requiresAdmin: false,
      },
      {
        path: HR_PAGE_ROUTES.TIME_LOG_EDIT.substring(1),
        element: <TimeLogEditPage />,
        requiresAdmin: true,
      },
      {
        path: HR_PAGE_ROUTES.PAY_REPORT.substring(1),
        element: <EmployeePayReportPage />,
        requiresAdmin: false,
      }
    ]
  }
];