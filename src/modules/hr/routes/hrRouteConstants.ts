export const HR_PAGE_ROUTES = {
  EMPLOYEE_SETUP: '/hr/employee-setup',
  EMPLOYEES_LIST: '/hr/employees',
  EMPLOYEE_VIEW: '/hr/employees/:id',
  EMPLOYEE_EDIT: '/hr/employees/:id/edit',
  
  PAYROLL_CREATE: '/hr/payroll/create',
  PAYROLLS_LIST: '/hr/payrolls',
  PAYROLL_VIEW: '/hr/payrolls/:id',
  PAYROLL_EDIT: '/hr/payrolls/:id/edit',

  TIME_CLOCK: '/hr/time-clock',
} as const;