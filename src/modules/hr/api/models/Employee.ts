export interface EmployeeResponse {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  position: string;
  hire_date: string;
  termination_date: string | null;
  created_at: string;
}

export interface EmployeeCreateRequest {
  user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  position: string;
  hire_date: string;
}

export interface EmployeeUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  position?: string;
  hire_date?: string;
  termination_date?: string;
}