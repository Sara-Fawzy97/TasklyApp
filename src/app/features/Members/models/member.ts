export interface IMember{
    member_id:string;
    project_id:string;
    user_id:string;
role:string;
email:string;
metadata:{
    email:string;
    name:string;
    department:string;
}

}

export interface Invitation{
    p_email:string,
    p_project_id:string,
    p_app_url:string,
    p_base_url:string
}

export interface Token{
p_token?:string|null

}