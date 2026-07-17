import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

authService=inject(Auth)
errorMsg=signal("")
 router=inject(Router)

   loginForm=new FormGroup({
   email: new FormControl(null,[Validators.email,Validators.required]),
   password:new FormControl(null,Validators.required),
   
 })

 login(data:FormGroup){
this.authService.logIn(data.value).subscribe({
  next:(res:any)=>{
    console.log(res)
    localStorage.setItem('accessToken',res.access_token)
    localStorage.setItem('userName',res.user_metadata.name)
    localStorage.setItem('jobTitle',res.user_metadata.department)
    this.router.navigateByUrl('/dashboard');
  },
  error:(err)=> {
    console.log(err)
    this.errorMsg.set('Invalid email or password')
  },
})

 }


}
