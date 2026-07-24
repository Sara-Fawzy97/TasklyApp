import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Projects } from '../../services/projects';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-update-project',
  imports: [ReactiveFormsModule],
  templateUrl: './add-update-project.html',
  styleUrl: './add-update-project.css',
})
export class AddUpdateProject {

  projService=inject(Projects)
errorMsg=signal("")
project=this.projService.selectedProject();
// route=inject(Router)
 route = inject(ActivatedRoute);
projectId=0

ngOnInit(){
  console.log(this.project)
  this.projectId=this.route.snapshot.params['id']
  if(this.projectId){
    this.isedit.set(true)
  this.getProjData()

  }
}

 createProj=new FormGroup({
   name: new FormControl('',[Validators.required,Validators.min(3),Validators.pattern(/^(?=.{3,100}$)[\p{L}]+(?: [\p{L}]+)*$/u)]),
   description:new FormControl('',[Validators.max(500)])
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

 getProjData(){
  this.createProj.patchValue({
    name:this.project?.name,
    description:this.project?.description
  })
 }
isedit=signal(false)
 updateProj(data:FormGroup){
  this.projService.updateProject(data.value,this.projectId).subscribe({
    next:(res)=>{
      console.log(res)
    }
  })
 }
 onSubmit(data:FormGroup){
  if(this.projectId){
this.updateProj(data)
  }else { this.addNewProj(data)}
 }

 
}
