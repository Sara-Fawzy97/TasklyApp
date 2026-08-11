import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EpicService } from '../../services/epic-service';
import { ActivatedRoute, Router } from '@angular/router';
import { IEpic } from '../../models/IepicReq';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { Location } from '@angular/common';
import { MembersService } from '../../../Members/services/members-service';
import { IMember } from '../../../Members/models/member';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-add-epic',
  imports: [ReactiveFormsModule],
  templateUrl: './add-epic.html',
  styleUrl: './add-epic.css',
})
export class AddEpic {

  members = signal<IMember[]>([]);
  today = new Date().toISOString().split('T')[0];
  projectId = ''

  toastService = inject(Toastr);
  private route = inject(ActivatedRoute);
  epicService = inject(EpicService);
  router = inject(Router);
  memberService = inject(MembersService);
  private destroyRef = inject(DestroyRef);
  location = inject(Location);
  // EpicForm: any;

  ngOnInit() {
  this.projectId = this.route.snapshot.paramMap.get('id')!;

    this.getMembers();
  }

  

  createEpicForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3), 
      Validators.pattern(/^(?=.{3,100}$)[\p{L}\d\s\-_.()&]+$/u),
    ]),
    description: new FormControl('', [Validators.maxLength(500)]),
    assignee_id: new FormControl(''),
    deadline: new FormControl(this.today),
  },{validators:this.checkTitleSpace}
);


  checkTitleSpace(control: AbstractControl){
const name=control.get('title')?.value
  return name.startsWith(' ')?{startsWithSpace:true} :null

}


  createEpic() {
    const body: IEpic = {
      title: this.createEpicForm.value.title!,
      description: this.createEpicForm.value.description!,
      assignee_id: this.createEpicForm.value.assignee_id || null,
      deadline: this.createEpicForm.value.deadline! ||null ,
      project_id: this.projectId!,
    };


    this.epicService
      .createEpic(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
         console.log(this.createEpicForm.value);
          this.toastService.success('Epic created successfully', 'top-right');
        },
        error: (err) => {
          this.toastService.error(err.error.msg, 'top-right');
        },
        complete: () => {
          this.createEpicForm.reset();
          this.goBack();
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

  goBack() {
    this.location.back();
  }
}
