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
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-popup',
  imports: [ReactiveFormsModule, DatePipe],
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
  loadingUpdate=signal(false)
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
    title: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.maxLength(500)]),
    assignee_id: new FormControl<string | null>(''),
    due_date: new FormControl<string | null>(''),
    status: new FormControl(''),
    epic_id: new FormControl<string | null>(''),
  },  { validators: this.checkTitleSpace },
    );
  
    checkTitleSpace(control: AbstractControl) {
      const name = control.get('title')?.value;
      return name.startsWith(' ') ? { startsWithSpace: true } : null;
    }

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
    this.getTaskDetails();
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
            title: this.task()[0]?.title,
            description: this.task()[0]?.description,
            due_date: this.task()[0]?.deadline,
            assignee_id: this.task()[0]?.assignee?.id,
            status: this.task()[0].status,
            epic_id: this.task()[0].epic_id,
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

  isEditMode = false;

  startEditTitle() {
    this.isEditMode = true;
  }

  updateTitle() {
    const newTitle = this.taskForm.get('title')?.value?.trim();
    const oldTitle = this.task()[0].title;
    if (!newTitle || !this.taskId()) {
      this.taskForm.get('title')?.markAsTouched();
      return;
    }
    if (newTitle === oldTitle) {
      this.isEditMode = false;

      return;
    }

    this.task.update((tasks) =>
      tasks.map((task) => ({
        ...task,
        title: newTitle,
      })),
    );

    this.taskService
      .updateTaskStaus(this.taskId(), { title: newTitle })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
         this.loadingUpdate.set(true)
          this.toastService.success('Title is updated successfully', 'top-right');
        },
        error: () => {
          this.task.update((tasks) =>
            tasks.map((task) => ({
              ...task,
              title: oldTitle,
            })),
          );
          this.toastService.error('Failed to update task. Please try again.', 'top-right');
        },
        complete:()=> {
         this.loadingUpdate.set(false)
          
        },
      });
  }

  updateDescription() {
    const newDescription = this.taskForm.get('description')?.value?.trim()||null;
    const oldDes = this.task()[0].description??null;
   
    if (newDescription === oldDes) {
      this.isEditMode = false;
      return;
    }

    this.task.update((tasks) =>
      tasks.map((task) => ({
        ...task,
        description: newDescription,
      })),
    );
    this.taskService
      .updateTaskStaus(this.taskId(), { description: newDescription||null })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Description is updated successfully', 'top-right');
        },
        error: () => {
          this.task.update((tasks) =>
            tasks.map((task) => ({
              ...task,
              description: oldDes,
            })),
          );
          this.toastService.error('Failed to update task. Please try again.', 'top-right');
        },
      });
  }

  changeAssigne() {
    const new_assignee_id = this.taskForm.get('assignee_id')?.value?.trim();
    const old_assignee_id = this.task()[0].assignee?.id;

    if (new_assignee_id === old_assignee_id) {
      this.isEditMode = false;

      return;
    }

    this.task.update((tasks) =>
      tasks.map((task) => ({
        ...task,
        assignee: {
          id: new_assignee_id,
        },
      })),
    );

    this.taskService
      .updateTaskStaus(this.taskId(), { assignee_id: new_assignee_id || null })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Task is updated successfully', 'top-right');
        },
        error: () => {
          this.task.update((tasks) =>
            tasks.map((task) => ({
              ...task,
              assignee: {
                id: old_assignee_id,
              },
            })),
          );
          this.toastService.error('Failed to update task. Please try again.', 'top-right');
        },
      });
  }

  changeEpic() {
    const new_epic_id = this.taskForm.get('epic_id')?.value?.trim() || null;

    const old_epic_id = this.task()[0].epic_id;

    if (new_epic_id === old_epic_id) {
      this.isEditMode = false;

      return;
    }

    this.task.update((tasks) =>
      tasks.map((task) => ({
        ...task,
        epic_id: new_epic_id,
      })),
    );

    this.taskService
      .updateTaskStaus(this.taskId(), { epic_id: new_epic_id || null })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Task is updated successfully', 'top-right');
        },
        error: () => {
          this.task.update((tasks) =>
            tasks.map((task) => ({
              ...task,
              epic_id: old_epic_id,
            })),
          );

          this.toastService.error('Failed to update task. Please try again.', 'top-right');
        },
      });
  }

  changedate() {
    const newDeadline = this.taskForm.get('due_date')?.value?.trim() || null;
    const oldDeadline = this.task()[0].due_date;

    if (newDeadline === oldDeadline) {
      this.isEditMode = false;

      return;
    }

    this.task.update((tasks) =>
      tasks.map((task) => ({
        ...task,
        due_date: newDeadline,
      })),
    );
    this.taskService
      .updateTaskStaus(this.taskId(), { due_date: newDeadline || null })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Task is updated successfully', 'top-right');
        },
        error: () => {
          this.task.update((tasks) =>
            tasks.map((task) => ({
              ...task,
              due_date: oldDeadline,
            })),
          );
          this.toastService.error('Failed to update task. Please try again.', 'top-right');
        },
      });
  }

  changeStatus() {
    const newStatus = this.taskForm.get('status')?.value?.trim() ;

    const oldStatus = this.task()[0].status;

    if (newStatus === oldStatus) {
      this.isEditMode = false;

      return;
    }

    this.task.update((tasks) =>
      tasks.map((task) => ({
        ...task,
        status: newStatus,
      })),
    );

    this.taskService
      .updateTaskStaus(this.taskId(), { status: newStatus })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Task is updated successfully', 'top-right');
        },
        error: () => {
          this.task.update((tasks) =>
            tasks.map((task) => ({
              ...task,
              status: oldStatus,
            })),
          );
          this.toastService.error('Failed to update task. Please try again.', 'top-right');
        },
      });
  }
}
