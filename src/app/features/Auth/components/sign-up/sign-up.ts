import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { Toastr } from '../../../../core/services/toastr';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  authService = inject(Auth);
  errorMsg = '';
  showPassord = false;
  router = inject(Router);
  toastService = inject(Toastr);

  signUpForm = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^(?=.{3,50}$)[\p{L}]+(?: [\p{L}]+)*$/u),
      ]),
      jobTitle: new FormControl(null),
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,64}$/),
      ]),
      confirmedPassword: new FormControl(null, Validators.required),
    },
    { validators: this.checkPasswords },
  );

  checkPasswords(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmedPassword = control.get('confirmedPassword')?.value;
    if (!password || !confirmedPassword) {
      return null;
    }
    return password === confirmedPassword ? null : { passwordMisMatch: true };
  }

  signUp(data: FormGroup) {

     const body = {
    email: data.value.email,
    password: data.value.password,
    data: {
      name: data.value.name,
      department: data.value.jobTitle
    }
  };
  console.log(data.value);
    this.authService.signUp(body).subscribe({
      next: (res) => {
        console.log(res);
        this.toastService.success('Congratulations, you have a new account!','top-right');

        sessionStorage.setItem('accessToken',res.access_token)
      },
      error: (err) => {
        console.log(err.error.msg);
        this.errorMsg = err.msg;
        this.toastService.error('Something went Wrong !','top-right');

      },
      complete: () => {
        
        this.router.navigateByUrl('/project');
      },
    });
  }

  get password() {
    return this.signUpForm.get('password');
  }

  toggleShowPassword() {
    this.showPassord = !this.showPassord;
  }
}
