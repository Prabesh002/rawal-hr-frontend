import { apiCaller } from '@/api/caller/apiCaller';
import { HR_API_ROUTES } from '../api/routes/hrApiRoutes';
import type {
  EmployeeResponse,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
} from '../api/models/Employee';
import type {
  PayrollResponse,
  PayrollCreateRequest,
  PayrollUpdateRequest,
} from '../api/models/Payroll';
import type {
  SalaryRateResponse,
  SalaryRateCreateRequest,
  SalaryRateUpdateRequest,
} from '../api/models/SalaryRate';
import type { TimeLogResponse } from '../api/models/TimeLog';

export const useHrService = () => {

  const getEmployees = async (): Promise<EmployeeResponse[]> => {
    return apiCaller<EmployeeResponse[]>({
      url: HR_API_ROUTES.EMPLOYEES,
      method: 'GET',
    });
  };
  
  const getEmployeeById = async (id: string): Promise<EmployeeResponse> => {
    return apiCaller<EmployeeResponse>({
      url: HR_API_ROUTES.EMPLOYEE_BY_ID(id),
      method: 'GET',
    });
  };

  const createEmployee = async (data: EmployeeCreateRequest): Promise<EmployeeResponse> => {
    return apiCaller<EmployeeResponse>({
      url: HR_API_ROUTES.EMPLOYEES,
      method: 'POST',
      data,
    });
  };

  const updateEmployee = async (id: string, data: EmployeeUpdateRequest): Promise<EmployeeResponse> => {
    return apiCaller<EmployeeResponse>({
      url: HR_API_ROUTES.EMPLOYEE_BY_ID(id),
      method: 'PUT',
      data,
    });
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    return apiCaller<void>({
      url: HR_API_ROUTES.EMPLOYEE_BY_ID(id),
      method: 'DELETE',
    });
  };

  const getPayrolls = async (): Promise<PayrollResponse[]> => {
    return apiCaller<PayrollResponse[]>({
      url: HR_API_ROUTES.PAYROLLS,
      method: 'GET',
    });
  };

  const getPayrollById = async (id: string): Promise<PayrollResponse> => {
    return apiCaller<PayrollResponse>({
      url: HR_API_ROUTES.PAYROLL_BY_ID(id),
      method: 'GET',
    });
  };

  const createPayroll = async (data: PayrollCreateRequest): Promise<PayrollResponse> => {
    return apiCaller<PayrollResponse>({
      url: HR_API_ROUTES.PAYROLLS,
      method: 'POST',
      data,
    });
  };

  const updatePayroll = async (id: string, data: PayrollUpdateRequest): Promise<PayrollResponse> => {
    return apiCaller<PayrollResponse>({
      url: HR_API_ROUTES.PAYROLL_BY_ID(id),
      method: 'PUT',
      data,
    });
  };

  const deletePayroll = async (id: string): Promise<void> => {
    return apiCaller<void>({
      url: HR_API_ROUTES.PAYROLL_BY_ID(id),
      method: 'DELETE',
    });
  };

  const getSalaryRatesByEmployee = async (employeeId: string): Promise<SalaryRateResponse[]> => {
    return apiCaller<SalaryRateResponse[]>({
      url: HR_API_ROUTES.GET_RATES_BY_EMPLOYEE_ID(employeeId),
      method: 'GET',
    });
  };

  const createSalaryRate = async (data: SalaryRateCreateRequest): Promise<SalaryRateResponse> => {
    return apiCaller<SalaryRateResponse>({
      url: HR_API_ROUTES.SALARY_RATES,
      method: 'POST',
      data,
    });
  };

  const updateSalaryRate = async (id: string, data: SalaryRateUpdateRequest): Promise<SalaryRateResponse> => {
    return apiCaller<SalaryRateResponse>({
      url: HR_API_ROUTES.SALARY_RATE_BY_ID(id),
      method: 'PUT',
      data,
    });
  };

  const deleteSalaryRate = async (id: string): Promise<void> => {
    return apiCaller<void>({
      url: HR_API_ROUTES.SALARY_RATE_BY_ID(id),
      method: 'DELETE',
    });
  };

  const getActiveShift = async (): Promise<TimeLogResponse | null> => {
    return apiCaller<TimeLogResponse | null>({
      url: HR_API_ROUTES.TIME_LOG_ACTIVE,
      method: 'GET',
    });
  };

  const startShift = async (): Promise<TimeLogResponse> => {
    return apiCaller<TimeLogResponse>({
      url: HR_API_ROUTES.TIME_LOG_START,
      method: 'POST',
    });
  };

  const stopShift = async (logId: string): Promise<TimeLogResponse> => {
    return apiCaller<TimeLogResponse>({
      url: HR_API_ROUTES.TIME_LOG_STOP(logId),
      method: 'PUT',
    });
  };

  return {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,

    getPayrolls,
    getPayrollById,
    createPayroll,
    updatePayroll,
    deletePayroll,

    getSalaryRatesByEmployee,
    createSalaryRate,
    updateSalaryRate,
    deleteSalaryRate,

    getActiveShift,
    startShift,
    stopShift,
  };
};