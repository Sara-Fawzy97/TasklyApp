import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

authService= inject(Auth)
router=inject(Router)
errorMsg=''
showPassord=false

    resestPassForm=new FormGroup({
   password:new FormControl(null,[Validators.required,Validators.pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,64}$/)]),
   confirmedPassword:new FormControl(null,Validators.required)
 })

 signUp(data:FormGroup){
this.authService.updatePassword(data.value).subscribe({
  next:(res)=>{
    console.log(res)
  },error:(err)=>{
    console.log(err.error.msg)
    this.errorMsg=err.msg
  },
  complete:()=>{
        this.router.navigateByUrl('/login')
  }
})
}

 get password(){
 return this.resestPassForm.get('password')
 }

 toggleShowPassword(){
this.showPassord=!this.showPassord
}

}
