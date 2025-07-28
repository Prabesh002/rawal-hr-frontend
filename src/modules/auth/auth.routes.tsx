import { AppRoute } from '@/router/types';
import EmptyLayout from './components/layouts/EmptyLayout';
import { AUTH_PAGE_ROUTES } from './routes/authRouteConstants';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export const authRoutes: AppRoute[] = [
  {
    element: <EmptyLayout />,
    children: [
      {
        path: AUTH_PAGE_ROUTES.LOGIN.slice(1),
        element: <LoginPage />,
        isPublic: true
      },
      {
        path: AUTH_PAGE_ROUTES.REGISTER.slice(1),
        element: <RegisterPage />,
        isPublic: true
      }
    ]
  }
];