export interface User{
    id:string;
    access_token:string;
    refresh_token:string;
    user_metadata:{
        name:string;
        department:string
    }
}