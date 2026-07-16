import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {

  
   const modifiedReq=req.clone({
      url:`${environment.supabaseUrl}${req.url}`
      , setHeaders:{
        apikey:`${environment.supabaseKey}`
        // Authorization:`Bearer ${auth}`
      }
    })
  return next(modifiedReq);
};
