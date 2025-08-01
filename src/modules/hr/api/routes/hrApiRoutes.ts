import { API_BASE_URL } from '@/modules/core/api/routes/baseRoutes';

const HR_BASE = `${API_BASE_URL}/hr`;

export const HR_API_ROUTES = {
  EMPLOYEES: `${HR_BASE}/employees`,
  EMPLOYEE_BY_ID: (id: string) => `${HR_BASE}/employees/${id}`,

  PAYROLLS: `${HR_BASE}/payrolls`,
  PAYROLL_BY_ID: (id: string) => `${HR_BASE}/payrolls/${id}`,

  SALARY_RATES: `${HR_BASE}/salary-rates`,
  SALARY_RATE_BY_ID: (id: string) => `${HR_BASE}/salary-rates/${id}`,
  GET_RATES_BY_EMPLOYEE_ID: (employeeId: string) => `${HR_BASE}/salary-rates/employee/${employeeId}`,

  TIME_LOGS: `${HR_BASE}/time-logs`,
  TIME_LOG_BY_ID: (logId: string) => `${HR_BASE}/time-logs/${logId}`,
  TIME_LOGS_BY_EMPLOYEE: (employeeId: string) => `${HR_BASE}/time-logs/employee/${employeeId}`,
  TIME_LOG_START: `${HR_BASE}/time-logs/start`,
  TIME_LOG_STOP: (logId: string) => `${HR_BASE}/time-logs/${logId}/stop`,
  TIME_LOG_ACTIVE: `${HR_BASE}/time-logs/active`,
};