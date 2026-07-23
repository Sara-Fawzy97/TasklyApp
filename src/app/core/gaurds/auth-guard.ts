import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
const router=inject(Router);
  if(localStorage.getItem('accessToken')!==null || sessionStorage.getItem('accessToken')!==null){
    return true;
  }else {
       router.navigateByUrl('/');

    return false;}
};
