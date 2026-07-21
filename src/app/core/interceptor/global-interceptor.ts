import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Auth } from '../../features/Auth/services/auth';
import { environment } from '../../../environments/environment';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {

// const authService=inject(Auth)

const auth=localStorage.getItem('accessToken')??sessionStorage.getItem('accessToken')
// const refreshToken =
//   localStorage.getItem('refreshToken') ??
//   sessionStorage.getItem('refreshToken');

  
  
   const modifiedReq=req.clone({
      url:`${environment.supabaseUrl}${req.url}`
      , setHeaders:{
        apikey:`${environment.supabaseKey}`,
        Authorization:`Bearer ${auth}`
      }
    })

  return next(modifiedReq);




};
