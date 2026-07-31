export interface IEpic{
    title:string;
    description:string;
   assignee_id:string;
   project_id:string;
   deadline:string;
}

export interface IEpicRes{
epic_id:string;
title:string;
created_at:string;
created_by:{
     name:string
};
assignee:{
    name:string;
}
}