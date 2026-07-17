import { Routes } from '@angular/router';
import { SignUp } from './features/Auth/components/sign-up/sign-up';
import { Login } from './features/Auth/components/login/login';

export const routes: Routes = [
   {path:'', component:SignUp},
   {path:'login', component:Login},
];
