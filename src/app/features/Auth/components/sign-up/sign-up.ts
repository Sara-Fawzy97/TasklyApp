import { Component, inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {

authService= inject(Auth)

   signUpForm=new FormGroup({
   name:new FormControl(null,[Validators.required,Validators.min(3),Validators.max(50),Validators.pattern(/^[\p{L}]+(?: [\p{L}]+)*$/u)]),
   jobTitle:new FormControl (null),
   email: new FormControl(null,[Validators.email,Validators.required]),
   password:new FormControl(null,[Validators.required,Validators.pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,64}$/)]),
   confirmedPassword:new FormControl(null,Validators.required)
 })

 signUp(data:FormGroup){
this.authService.signUp(data.value).subscribe({
  next:(res)=>{
    console.log(res)
  },error:(err)=>{
    console.log(err)
  },
})

  console.log(this.signUpForm.value)
 }
}
