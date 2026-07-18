import { Routes } from '@angular/router';
import { SignUp } from './features/Auth/components/sign-up/sign-up';
import { Login } from './features/Auth/components/login/login';
import { Dashboard } from './shared/layout/dashboard/dashboard';
import { authGuard } from './core/gaurds/auth-guard';
// import { Dashboard } from './shared/layout/dashboard/dashboard';

export const routes: Routes = [
   {path:'', component:SignUp},
   {path:'login', component:Login},
   {path:'dashboard',canActivate:[authGuard], component:Dashboard},
   // {path:'dashboard',
   //     loadChildren: () => import('./shared/layout/dashboard/dashboard').then(m => m.Dashboard) },

   
];
