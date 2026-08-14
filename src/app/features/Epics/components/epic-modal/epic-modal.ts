import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EpicService } from '../../services/epic-service';
import { IEpicRes } from '../../models/IepicReq';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MembersService } from '../../../Members/services/members-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IMember } from '../../../Members/models/member';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { Spinner } from "../../../../shared/components/spinner/spinner";
import { Sharedservice } from '../../../../shared/services/sharedservice';


export interface Task {
  project_id?:string;
    epic_id?: string|null,
  title?: string|null,
  description?: string|null,
  assignee:{id: string|null
    name:string
  },
  due_date?:string|null,
  status?: string|null
}

@Component({
  selector: 'app-epic-modal',
  imports: [ReactiveFormsModule, DatePipe, Spinner],
  templateUrl: './epic-modal.html',
  styleUrl: './epic-modal.css',
})
export class EpicModal {
 
  today = new Date().toISOString().split('T')[0];
  myDate: Date = new Date();
  members = signal<IMember[]>([]);
  epic = signal<IEpicRes | null>(null);
  tasks=signal<Task[]>([])
  epicId = input<string>('');
  closee = output();
projectId=''
loaded=true
  showSpinner = false;
   route = inject(ActivatedRoute);
  memberService = inject(MembersService);
  private destroyRef = inject(DestroyRef);
  toastService = inject(Toastr);
  epicService = inject(EpicService);
  router=inject(Router)
sharedService=inject(Sharedservice)


  //  title = 'spinnerapp';
   ngOnInit() {
  this.projectId = this.route.snapshot.params['id'];
  
this.spinner()
    this.getOneEpic();
    this.getTasks()
  }

  spinner() {
    
      this.sharedService.spinner$.subscribe((data: boolean) => {
        setTimeout(() => {
          this.showSpinner = data ? data : false;
        });
        console.log(this.showSpinner);
      });
  }

  closeModal() {
    this.closee.emit();
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

  EpicForm = new FormGroup(
    {
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^(?=.{3,100}$)[\p{L}\d\s\-_.()&]+$/u),
      ]),
      description: new FormControl('', [Validators.maxLength(500)]),
      assignee_id: new FormControl(''),
      deadline: new FormControl(''),
    },
    { validators: this.checkTitleSpace },
  );

  checkTitleSpace(control: AbstractControl) {
    const name = control.get('title')?.value;
    return name.startsWith(' ') ? { startsWithSpace: true } : null;
  }

  getOneEpic() {
    this.epicService
      .getEpicDetails(this.projectId, this.epicId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.epic.set(res[0]);
          this.getMembers();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.EpicForm.patchValue({
            title: this.epic()?.title,
            description: this.epic()?.description,
            deadline: this.epic()?.deadline,
            assignee_id: this.epic()?.assignee?.sub,
          });
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
        },
      });
  }

  updateTitle() {
    const title = this.EpicForm.get('title')?.value?.trim();

    if (!title || !this.epicId()) {
      this.EpicForm.get('title')?.markAsTouched();
      return;
    }
    this.epicService
      .updateEpic(this.epicId(), { title })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Title is updated successfully', 'top-right');
        },
        error: () => {
          this.toastService.error('Failed to update epic. Please try again.', 'top-right');
        },
        complete: () => {
          this.toastService.success('Title is updated successfully', 'top-right');
        },
      });
  }

  updateDescription() {
    const description = this.EpicForm.get('description')?.value?.trim();

    this.epicService
      .updateEpic(this.epicId(), { description })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Description is updated successfully', 'top-right');
        },
        error: () => {
          this.toastService.error('Failed to update epic. Please try again.', 'top-right');
        },
      });
  }

  updateAssinee() {
    const assignee_id = this.EpicForm.get('assignee_id')?.value?.trim();

    this.epicService
      .updateEpic(this.epicId(), { assignee_id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Epic is updated successfully', 'top-right');
        },
        error: () => {
          this.toastService.error('Failed to update epic. Please try again.', 'top-right');
        },
      });
  }

  updateDeadline() {
    const deadline = this.EpicForm.get('deadline')?.value?.trim();

    this.epicService
      .updateEpic(this.epicId(), { deadline })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Deadline is updated successfully', 'top-right');
        },
        error: () => {
          this.toastService.error('Failed to update epic. Please try again.', 'top-right');
        },
      });
  }
// "/project",projectId,"tasks","new"
  navToTasks(){
    console.log('555')
    this.router.navigate(['/project/'+this.projectId+'/tasks/new'],{state:{data:this.epicId()}})



  

  getTasks(){
    this.epicService.getEpicTasks(this.epicId()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:(res)=>{
        this.tasks.set(res)
        this.loaded=false
      }
    })
  }

   async copyPageUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.toastService.success('URL copied to clipboard!', 'top-right');
    } catch (err) {
          this.toastService.error('Failed to copy URL: '+ err, 'top-right');

    }
  }
}
