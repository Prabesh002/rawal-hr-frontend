export interface TimeLogResponse {
  id: string; 
  employee_id: string;
  start_time: string;
  end_time: string | null;
  created_at: string;
}

export interface TimeLogUpdateRequest {
  start_time?: string;
  end_time?: string | null;
}