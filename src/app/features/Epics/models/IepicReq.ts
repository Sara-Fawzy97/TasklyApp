export interface IEpic {
  id?: string;
  title: string;
  description?: string;
  assignee_id?: string |null ;
  project_id: string;
  deadline: string | null;
}

export interface IEpicRes {
  id: string;
  description:string;
  deadline:string;
  epic_id: string;
  title: string;
  created_at: string;
  created_by: {
    name: string;
  };
  assignee: {
    name?: string;
    sub:string |null;
  };
}



