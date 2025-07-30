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
  TIME_LOGS_LIST: '/hr/time-logs',
  TIME_LOG_VIEW: '/hr/time-logs/:id',
  TIME_LOG_EDIT: '/hr/time-logs/:id/edit',
  
  PAY_REPORT: '/hr/pay-report',
} as const;