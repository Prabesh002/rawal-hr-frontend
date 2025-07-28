export interface PayrollResponse {
  id: string; 
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string; 
  payment_date: string | null;
  total_hours: number;
  gross_pay: number;
  deductions: number;
  net_pay: number;
  status: string;
  created_at: string;
}

export interface PayrollCreateRequest {
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  total_hours: number;
  gross_pay: number;
  deductions?: number;
  net_pay: number;
}

export interface PayrollUpdateRequest {
  payment_date?: string;
  status?: string;
}