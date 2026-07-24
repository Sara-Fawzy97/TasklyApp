import { Routes } from '@angular/router';
import { SignUp } from './features/Auth/components/sign-up/sign-up';
import { Login } from './features/Auth/components/login/login';
import { authGuard } from './core/gaurds/auth-guard';
import { ForgotPassword } from './features/Auth/components/forgot-password/forgot-password';
import { ResetPassword } from './features/Auth/components/reset-password/reset-password';
// import { Dashboard } from './shared/layout/dashboard/dashboard';

export const routes: Routes = [
   {path:'sign-up', component:SignUp},
   {path:'login', component:Login},
//    {path:'dashboard',canActivate:[authGuard], component:Dashboard},
    {path:'',canActivate:[authGuard],
       loadChildren: () => import('./shared/layout/dashboard/dashboard.routes').then(m => m.Dashboard_routes) },
   // {path:'dashboard',
   //     loadChildren: () => import('./shared/layout/dashboard/dashboard').then(m => m.Dashboard) },
   {path:'forgot-password', component:ForgotPassword},
   {path:'reset-password', component:ResetPassword},

    
];
