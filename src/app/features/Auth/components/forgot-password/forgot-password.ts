import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

authService=inject(Auth)
errorMsg=signal("")
 router=inject(Router)
 display=false

     forgotPassForm=new FormGroup({
       email: new FormControl(null,[Validators.email,Validators.required])
    })

     submitForm(data:FormGroup){
      this.authService.forgotPassword(data.value).subscribe({
        next:(res)=>{
          this.display=true
          console.log(this.display)
          console.log(res)
        },error:(err)=>{
          this.errorMsg=err.error.massage
        }
      })
    
     }
}
