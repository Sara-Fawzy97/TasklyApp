import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
   loginForm=new FormGroup({
   email: new FormControl(null,[Validators.email,Validators.required]),
   password:new FormControl(null,Validators.required),
   
 })

 login(data:FormGroup){
this.authService.logIn(data.value).subscribe({
  next:(res)=>{
    // console.log(res.access_token)
    localStorage.setItem('accessToken',res.access_token)
  },
  error:(err)=> {
    console.log(err)
    this.errorMsg.set('Invalid email or password')
  },
})

 }

}
