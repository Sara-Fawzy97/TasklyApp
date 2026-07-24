import { Component, inject, signal } from '@angular/core';
import { Projects } from '../../services/projects';
import { Project } from '../../models/project';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-projects',
  imports: [RouterLink,DatePipe],
  templateUrl: './list-projects.html',
  styleUrl: './list-projects.css',
})
export class ListProjects {

projects = signal<Project[]>([]);
 myDate: Date = new Date(); 
   projeService=inject(Projects)
 router=inject(Router)
 errorDisplayed=signal(false)
 isLoading=signal(true)

   ngOnInit(){
    this.getProjects()
   }

   getProjects(){
    this.projeService.getProject().subscribe({
      next:(res)=>{
        console.log(res)
        this.projects.set(res)
this.isLoading.set(false)

      },error:(err)=>{
        console.log(err)
        if(err.status===401){
this.isLoading.set(false)
    this.router.navigateByUrl('/login');
        }else
          {this.errorDisplayed.set(true)}
      },complete:()=> {
// this.isLoading.set(false)
        
      },

    })
   }

   getOneProj(project:Project){
    this.projeService.selectedProject.set(project)
    this.router.navigate(['project/'+project.id+'/edit'])
   }
}


