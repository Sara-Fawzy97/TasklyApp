import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Toastr } from '../../shared/components/success-toastr/service/toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(Toastr);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // if(error.status===401){
      //   localStorage.removeItem('accessToken')
      //   localStorage.removeItem('refreshToken')
      // router.navigateByUrl('/');

      // }

      switch (error.status) {
        case 400:
          toastService.error('Bad Request', 'top-right');
          break;
        case 401:
          toastService.error('Unauthorized. Please log in again.', 'top-right');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          router.navigateByUrl('/');
          break;
        case 403:
          toastService.error('Forbidden. Please log in again.', 'top-right');
           localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          router.navigateByUrl('/');
          break;

        case 404:
          toastService.error('Resource not found.', 'top-right');
          break;
        case 500:
          toastService.error('Internal Server Error', 'top-right');
          break;
          default: 
          toastService.error(error.message, 'top-right');

      }
      return throwError(error);
    }),
  );

  // return next(req);
};
