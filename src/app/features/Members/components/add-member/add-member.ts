import { Component, DestroyRef, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembersService } from '../../services/members-service';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-member',
  imports: [ReactiveFormsModule],
  templateUrl: './add-member.html',
  styleUrl: './add-member.css',
})
export class AddMember {
  projectId = '';
  isLoading=false
 closee = output();
  memberService = inject(MembersService);
  toastrService = inject(Toastr);
  private destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  toastService = inject(Toastr);

  addMemberForm = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
  });

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
  }


   closeModal() {
    this.closee.emit();
  }

  sendInvitation(data: FormGroup) {
    this.isLoading=true
    const body = {
      p_email: data.value.email,
      p_project_id: this.projectId,
      p_app_url: window.location.origin,
      p_base_url: 'https://kuncjqsalpsqfohvzvfa.supabase.co',
    };
    this.memberService
      .sendInvit(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
    this.isLoading=false

          this.toastService.success('Invitation sent successfully', 'top-right');
        },
        error: (error) => {
    this.isLoading=false

          this.toastService.error(error.message, 'top-right');
        },
      });
  }
}
