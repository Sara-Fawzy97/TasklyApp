import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { EpicService } from '../../services/epic-service';
import { IEpicRes } from '../../models/IepicReq';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';

@Component({
  selector: 'app-all-epics',
  imports: [DatePipe, RouterLink],
  templateUrl: './all-epics.html',
  styleUrl: './all-epics.css',
})
export class AllEpics {
  isLoading = signal(true);
  myDate: Date = new Date();
  epics = signal<IEpicRes[]>([]);

  route = inject(ActivatedRoute);
  epicService = inject(EpicService);
  private destroyRef = inject(DestroyRef);
  projectId = this.route.snapshot.params['id'];
  toastService=inject(Toastr)

  ngOnInit() {
    this.getEpics();
  }

  value = '';
  getInitials(name: string) {
    if (!name) return '';

    const words = name.trim().split('');

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  getEpics() {
    this.epicService
      .getAllEpics(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.epics.set(res);
        },
        error: (err) => {
          this.toastService.error(err.error.msg, 'top-right');
        },
      });
  }
}
