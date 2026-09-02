export interface Task {
  id?: string;
  project_id?: string;
  epic_id?: string | null;
  title?: string | null;
  description?: string | null;
  assignee?: {
    name?: string;
    id?: string;
  };
  due_date?: string | null;
  status?: string | null;
  task_id?: string;
  created_at?: string;
  deadline?: string;
  created_by?: {
    name: string;
  };
  epic?:{
    title:string,
    id:string,
    epic_id:string
  }
}

export interface TaskReq{
   title?:string,
   description?:string
  assignee_id?:string|null,
  due_date?:string,
  status?:string,
  epic_id?:string,
}