import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Toastr } from '../../../../core/services/toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);


  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, Validators.required),
    rememberMe: new FormControl(false),
  });

  login(data: FormGroup) {
    this.authService.logIn(data.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
          localStorage.setItem('accessToken', res.access_token);
          localStorage.setItem('refreshToken', res.refresh_token);
       
        this.toastService.success('You are logged in successfully','top-right');

      },
      error: () => {
        this.errorMsg.set('Invalid email or password');
        this.toastService.error('Somthing went Wrong !','top-right');
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
