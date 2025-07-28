import React from 'react';

export interface AppRoute {
  path?: string; 
  element: React.ReactElement; 
  children?: AppRoute[]; 
  index?: boolean; 
  isPublic?: boolean;
  requiresAuth?: boolean;
}