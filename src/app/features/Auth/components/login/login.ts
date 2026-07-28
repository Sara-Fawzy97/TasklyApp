import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Toastr } from '../../../../core/services/toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(Auth);
  errorMsg = signal('');
  router = inject(Router);
  showPassword = false;
  //  remember=false
toastService = inject(Toastr);

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, Validators.required),
    rememberMe: new FormControl(false),
  });

  login(data: FormGroup) {
    this.authService.logIn(data.value).subscribe({
      next: (res) => {
        console.log(res);
        const remember = this.loginForm.value.rememberMe;
        if (remember == true) {
          localStorage.setItem('accessToken', res.access_token);
          localStorage.setItem('refreshToken', res.refresh_token);
        } else {
          sessionStorage.setItem('accessToken', res.access_token);
          sessionStorage.setItem('refreshToken', res.refresh_token);
        }
        this.toastService.success('You are logged successfully','top-right');

        // localStorage.setItem('userName',res.user_metadata.name)
        // localStorage.setItem('jobTitle',res.user_metadata.department)
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set('Invalid email or password');
        this.toastService.error('Somthing Wrong !','top-right');
      },
      complete: () => {
        this.router.navigateByUrl('/project');
      },
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
