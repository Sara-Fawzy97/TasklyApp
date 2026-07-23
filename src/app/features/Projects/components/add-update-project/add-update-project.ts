import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Projects } from '../../services/projects';

@Component({
  selector: 'app-add-update-project',
  imports: [ReactiveFormsModule],
  templateUrl: './add-update-project.html',
  styleUrl: './add-update-project.css',
})
export class AddUpdateProject {

  projService=inject(Projects)
errorMsg=signal("")


 createProj=new FormGroup({
   name: new FormControl(null,[Validators.required,Validators.min(3),Validators.pattern(/^(?=.{3,100}$)[\p{L}]+(?: [\p{L}]+)*$/u)]),
   description:new FormControl(null,[Validators.max(500)])
 })

 addNewProj(data:FormGroup){
 this.projService.addNew(data.value).subscribe({
      next:(res)=>{
        console.log(res)

      }, error:(err)=>{
        this.errorMsg=err.error.message
        console.log(err)
      },complete:()=>{
         this.createProj.reset()
  }
 })
  // console.log(data)
 }

}
