import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { map, Observable, takeWhile, timer } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  authService = inject(Auth);
  errorMsg = signal('');
  router = inject(Router);
  display = signal(false);
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
        next: (res) => {
          this.display.set(true);
          console.log(this.display());
          console.log(res);
        },
        error: (err) => {
          this.toastService.error('Something went Wrong !', 'top-right');

          this.errorMsg = err.error.massage;
        },
        complete: () => {
          this.countdown();
        },
      });
  }

  timeRemaining$!: Observable<number>;
  seconds = 300; //5 mins

  countdown() {
    this.timeRemaining$ = timer(0, 1000).pipe(
      map((n) => (this.seconds - n) * 1000),
      takeWhile((n) => n >= 0, true),
    );
  }
}
