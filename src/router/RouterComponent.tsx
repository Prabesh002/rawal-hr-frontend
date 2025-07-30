import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AppRoute } from './types';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

const buildRoutesRecursive = (routes: AppRoute[]): React.ReactNode[] => {
  const { isAuthenticated, isAdmin } = useAuth();

  return routes.map((route, i) => {
    const { path, element, children, index, requiresAuth, requiresAdmin } = route;

    let routeElement = element;

    if (requiresAdmin && !isAdmin) {
      routeElement = <Navigate to="/unauthorized" replace />;
    } else if (requiresAuth && !isAuthenticated) {
      routeElement = <Navigate to="/unauthorized" replace />;
    }

    if (index) {
      return (
        <Route key={`index-${i}`} index element={routeElement} />
      );
    }

    return (
      <Route key={path ?? `route-${i}`} path={path!} element={routeElement}>
        {children && buildRoutesRecursive(children)}
      </Route>
    );
  });
};


export const AppRouter: React.FC<{ routes: AppRoute[] }> = ({ routes }) => {
  return (
    <Routes>
      {buildRoutesRecursive(routes)}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};