export interface Task {
    project_id?:string;
    epic_id?: string|null,
  title?: string|null,
  description?: string|null,
  assignee?:{
    name:string,
  },
  due_date?:string|null,
  status?: string|null
}