import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { IEpicRes } from '../../../Epics/models/IepicReq';
import { EpicService } from '../../../Epics/services/epic-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { IMember } from '../../../Members/models/member';
import { MembersService } from '../../../Members/services/members-service';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../../services/tasks-service';
import { Task } from '../../models/ITask';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-popup',
  imports: [ReactiveFormsModule,DatePipe],
  templateUrl: './task-popup.html',
  styleUrl: './task-popup.css',
})
export class TaskPopup {
  statuses = [
    'TO_DO',
    'IN_PROGRESS',
    'BLOCKED',
    'IN_REVIEW',
    'READY_FOR_QA',
    'REOPENED',
    'READY_FOR_PRODUCTION',
    'DONE',
  ];
  task = signal<Task[]>([]);
  closee = output();
  epics = signal<IEpicRes[]>([]);
  taskId = input<string>('');
  isLoading = signal(true);
  today = new Date().toISOString().split('T')[0];
  myDate: Date = new Date();
  members = signal<IMember[]>([]);
  epicService = inject(EpicService);
  private destroyRef = inject(DestroyRef);
  projectId = '';
  toastService = inject(Toastr);
  route = inject(ActivatedRoute);
  taskService = inject(TasksService);
  memberService = inject(MembersService);

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
    this.getTaskDetails();
   
  }

  taskForm = new FormGroup({
    // description: new FormControl('', [Validators.maxLength(500)]),
    assignee_id: new FormControl(''),
    deadline: new FormControl(''),
    status: new FormControl(''),
    epic_id:new FormControl('')
  });

  value = '';
  getInitials(name: string | undefined) {
    if (!name) return '';

    const words = name.trim().split('');

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  closeModal() {
    this.closee.emit();
  }

  getTaskDetails() {
    this.taskService
      .getTaskDetails(this.projectId, this.taskId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.task.set(res);
           this.getEpics();
    this.getMembers();
        },
        error: () => {
          console.log('dd');
        },
        complete: () => {
          this.taskForm.patchValue({
            deadline: this.task()[0]?.deadline,
            assignee_id: this.task()[0]?.assignee?.id,
            status: this.task()[0].status,
            epic_id:this.task()[0].epic_id
          });
        },
      });
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

  getMembers() {
    this.memberService
      .getProjMembers(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.members.set(res);
          console.log(res);
        },
      });
  }

  async copyPageUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.toastService.success('URL copied to clipboard!', 'top-right');
    } catch (err) {
      this.toastService.error('Failed to copy URL: ' + err, 'top-right');
    }
  }
}
