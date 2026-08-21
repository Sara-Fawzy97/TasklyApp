import { Routes } from '@angular/router';
import { authGuard } from './core/gaurds/auth-guard';

export const routes: Routes = [
   {path: '', redirectTo: 'login', pathMatch: 'full'},
   {path:'sign-up', loadComponent:()=>import('./features/Auth/components/sign-up/sign-up').then(c=>c.SignUp)},
   {path:'login', loadComponent:()=>import('./features/Auth/components/login/login').then(c=>c.Login)},
   {path:'',canActivate:[authGuard],
       loadChildren: () => import('./shared/layout/dashboard/dashboard.routes').then(m => m.Dashboard_routes) },
    
   {path:'forgot-password', loadComponent:()=>import('./features/Auth/components/forgot-password/forgot-password').then(c=>c.ForgotPassword)},
   {path:'reset-password', loadComponent:()=>import('./features/Auth/components/reset-password/reset-password').then(c=>c.ResetPassword)},

{
    path: 'invite',
    loadComponent: () =>
      import('./features/Members/components/accept-invitation/accept-invitation')
        .then(c => c.AcceptInvitation)
  },
    
];
