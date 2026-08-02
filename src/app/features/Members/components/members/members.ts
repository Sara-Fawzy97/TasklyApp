import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MembersService } from '../../services/members-service';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { ActivatedRoute } from '@angular/router';
import { IMember } from '../../models/member';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-members',
  imports: [],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members {
  isLoading = signal(true);
  errorDisplayed = signal(false);
  members = signal<IMember[]>([]);

  memberService = inject(MembersService);
  toastrService = inject(Toastr);
  private destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);

  value = '';
  getInitials(name: string) {
    if (!name) return '';

    const words = name.trim().split('');

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    const projectId = signal(this.route.snapshot.params['id']);

    this.memberService
      .getProjMembers(projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.members.set(res);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toastrService.error(err.error.message, 'top-right');
          this.errorDisplayed.set(true);
        },complete:()=> {
          this.isLoading.set(false);
          
        },
      });
  }
}
