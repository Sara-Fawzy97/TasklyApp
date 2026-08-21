import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { map, Observable, takeWhile, timer } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe,RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  errorMsg = signal('');
  display = signal(false);
  timeRemaining$!: Observable<number>;
  seconds = 300; //5 mins

  authService = inject(Auth);
  router = inject(Router);
  toastService = inject(Toastr);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.countdown();
  }

  forgotPassForm = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
  });

  submitForm(data: FormGroup) {
    this.authService
      .forgotPassword(data.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.display.set(true);
          console.log(this.display());
        },
        error: (err) => {
          this.toastService.error(err.error.msg, 'top-right');

          this.errorMsg = err.error.massage;
        },
        complete: () => {
          this.countdown();
        },
      });
  }

  

  countdown() {
    this.timeRemaining$ = timer(0, 1000).pipe(
      map((n) => (this.seconds - n) * 1000),
      takeWhile((n) => n >= 0, true),
    );
  }
}
