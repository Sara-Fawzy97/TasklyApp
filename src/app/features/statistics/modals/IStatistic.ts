export interface Statistic {
  p_start_date: string;
  p_end_date: string;
  p_project_id?: string|null;
  p_status?: string | null;
}

export interface TasksCount {
  project_id: string;
  project_name: string;
  tasks_count: number;
}
export interface TaskState {
  daily: CalenderDays[];
  totals: Record<string, number>;
  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
}

export interface CalenderDays {
  day: string;
  statuses: Record<string, number>;
}
