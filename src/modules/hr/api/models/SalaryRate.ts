export interface SalaryRateResponse {
  id: string; 
  employee_id: string;
  hourly_rate: number;
  effective_date: string;
  created_at: string;
}

export interface SalaryRateCreateRequest {
  employee_id: string;
  hourly_rate: number;
  effective_date: string; 
}

export interface SalaryRateUpdateRequest {
  hourly_rate?: number;
  effective_date?: string;
}