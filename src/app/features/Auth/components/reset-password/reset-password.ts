import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router,RouterLink  } from '@angular/router';
import { Toastr } from '../../../../core/services/toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,RouterLink ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

authService= inject(Auth)
router=inject(Router)
errorMsg=''
showPassord=false
  toastService = inject(Toastr);
accessToken = '';
  private readonly route=inject(ActivatedRoute)
  private destroyRef = inject(DestroyRef);


  resestPassForm=new FormGroup({
   password:new FormControl(null,[Validators.required,Validators.pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,64}$/)]),
   confirmedPassword:new FormControl(null,Validators.required)
 })

ngOnInit(){
   this.route.queryParamMap.subscribe(params => {
    this.accessToken = params.get('access_token') ?? '';
});
}

resetPassword(data:FormGroup){
  
this.authService.updatePassword(data.value,this.accessToken).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
  next:()=>{
        this.toastService.success('Your password has been updated successfully. You can now log in','top-right');

  },error:(err)=>{
    this.errorMsg=err.msg
        this.toastService.error('Something went wrong!','top-right');
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
