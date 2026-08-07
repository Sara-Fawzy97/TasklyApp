import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EpicService } from '../../services/epic-service';
import {  IEpicRes } from '../../models/IepicReq';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MembersService } from '../../../Members/services/members-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IMember } from '../../../Members/models/member';

@Component({
  selector: 'app-epic-modal',
  imports: [ReactiveFormsModule,DatePipe],
  templateUrl: './epic-modal.html',
  styleUrl: './epic-modal.css',
})
export class EpicModal {
  route = inject(ActivatedRoute);
  today = new Date().toISOString().split('T')[0];
  projectId = this.route.snapshot.params['id'];
  myDate: Date = new Date();
  members = signal<IMember[]>([]);
  epicId = input<string>('');
  closee = output();

  memberService = inject(MembersService);
  private destroyRef = inject(DestroyRef);
  
  closeModal() {
    this.closee.emit();
  }

  ngOnInit() {

    this.getOneEpic();
  }

  value = '';
  getInitials(name: string|undefined) {
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
    return name.startsWith('') ? { startsWithSpace: true } : null;
  }

  epicService = inject(EpicService);
  epic = signal<IEpicRes|null>(null);

  getOneEpic() {
    this.epicService.getEpicDetails(this.projectId, this.epicId()).subscribe({
      next: (res) => {
        console.log(res);
        this.epic.set(res[0])
    this.getMembers()

      },error:(err)=>{
        console.log(err)
      },complete:()=> {
        this.EpicForm.patchValue(
          {
            title:this.epic()?.title,
            description:this.epic()?.description,
            deadline:this.epic()?.deadline,
            assignee_id:this.epic()?.assignee?.sub
          }
        )
       
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
}
