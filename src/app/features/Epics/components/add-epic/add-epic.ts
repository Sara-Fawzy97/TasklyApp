import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EpicService } from '../../services/epic-service';
import { ActivatedRoute, Router } from '@angular/router';
import { IEpic } from '../../models/IepicReq';
import { Toastr } from '../../../../core/services/toastr';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-epic',
  imports: [ReactiveFormsModule],
  templateUrl: './add-epic.html',
  styleUrl: './add-epic.css',
})
export class AddEpic {


    toastService = inject(Toastr);
    private route = inject(ActivatedRoute);
  epicService=inject (EpicService)
   projectId = this.route.snapshot.paramMap.get('id')!;
  router = inject(Router);



   createEpicForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^(?=.{3,100}$)[\p{L}\d\s\-_.()&]+$/u),
    ]),
    description: new FormControl('', [Validators.maxLength(500)]),
    assignee_id:new FormControl(null),
    deadline:new FormControl (null),
    // project_id:new FormControl('')
  });
location= inject(Location)
goBack() {
  this.location.back();
} 

today = new Date().toISOString().split('T')[0];
  createEpic(){
    const body:IEpic={ 
     title: this.createEpicForm.value.title!,
    description: this.createEpicForm.value.description!,
    assignee_id: this.createEpicForm.value.assignee_id !|| null,
    deadline: this.createEpicForm.value.deadline!,
    project_id: this.projectId! };

  this.epicService.createEpic(body).subscribe({
    next:()=>{
      this.toastService.success('Epic created successfully', 'top-right');
    },error:()=>{
        this.toastService.error('Something went wrong','top-right');
    }, complete:()=>{
      this.createEpicForm.reset()
        this.router.navigateByUrl('/epics');
      
    }
  })
  }
}
