import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MembersService } from '../../../Members/services/members-service';
import { ActivatedRoute, Router} from '@angular/router';
import { IMember } from '../../../Members/models/member';
import { Location } from '@angular/common';
import { EpicService } from '../../../Epics/services/epic-service';
import { IEpicRes } from '../../../Epics/models/IepicReq';
import { Task } from '../../models/ITask';
import { TasksService } from '../../services/tasks-service';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';


@Component({
  selector: 'app-add-new-task',
  imports: [ReactiveFormsModule],
  templateUrl: './add-new-task.html',
  styleUrl: './add-new-task.css',
})
export class AddNewTask {
  members = signal<IMember[]>([]);
  today = new Date().toISOString().split('T')[0];
  projectId = '';
  epics = signal<IEpicRes[]>([]);
  toastService = inject(Toastr);

  status = [
    'TO_DO',
    'IN_PROGRESS',
    'BLOCKED',
    ' IN_REVIEW',
    'READY_FOR_QA',
    'REOPENED',
    'READY_FOR_PRODUCTION',
    'DONE',
  ];
isExpanded = false;
recievedData=''
epicId=history.state.data

 epicsService = inject(EpicService);
  memberService = inject(MembersService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  router=inject(Router);
  taskService = inject(TasksService);


  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.getMembers();
    this.getEpics();  

  }



        toggleText(){

          this.isExpanded = !this.isExpanded;

        }

  createTaskForm = new FormGroup(
    {
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^(?=.{3,100}$)[\p{L}\d\s\-_.()&]+$/u),
      ]),
      epic_id: new FormControl(this.epicId||''),
      description: new FormControl('', [Validators.maxLength(500)]),
      assignee_id: new FormControl(''),
      due_date: new FormControl(this.today),
      status: new FormControl(this.status[0]),
    },
    { validators: this.checkTitleSpace },
  );

  checkTitleSpace(control: AbstractControl) {
    const name = control.get('title')?.value;
    return name.startsWith(' ') ? { startsWithSpace: true } : null;
  }

  getMembers() {
    this.memberService
      .getProjMembers(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.members.set(res);
        },
      });
  }

 
  getEpics() {
    this.epicsService
      .getAllEpics(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.epics.set(res);
        },
      });
  }

  goBack() {
    this.location.back();
  }


  createTask() {
    const body: Task = {
      project_id: this.projectId,
      ...this.createTaskForm.value,
    };

    this.taskService
      .createTasks(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
                    this.toastService.success('new task is added', 'top-right');

        },
        error:(error)=>{
                    this.toastService.error(error.message, 'top-right');

        }
      });
  }


}
