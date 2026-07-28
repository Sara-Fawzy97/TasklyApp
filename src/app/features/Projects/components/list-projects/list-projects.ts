import { Component, inject, signal } from '@angular/core';
import { Projects } from '../../services/projects';
import { Project } from '../../models/project';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Pagination } from "../../../../shared/components/pagination/pagination";

@Component({
  selector: 'app-list-projects',
  imports: [RouterLink, DatePipe, Pagination],
  templateUrl: './list-projects.html',
  styleUrl: './list-projects.css',
})
export class ListProjects {
  projects = signal<Project[]>([]);
  myDate: Date = new Date();
  projeService = inject(Projects);
  router = inject(Router);
  errorDisplayed = signal(false);
  isLoading = signal(true);

  pageSize=10
  currentPage=1
  totalItems=0
  totalPages=1


  ngOnInit() {
    // this.getProjects();
    this.paginator()
  }

  getProjects() {
    this.projeService.getProject().subscribe({
      next: (res) => {
        // console.log(res);
        this.projects.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 401) {
          this.isLoading.set(false);
          this.router.navigateByUrl('/login');
        } else {
          this.errorDisplayed.set(true);
        }
      },
      complete: () => {
        // this.isLoading.set(false)
      },
    });
  }

  getOneProj(project: Project) {
    this.projeService.selectedProject.set(project);
    this.router.navigate(['project/' + project.id + '/edit']);
  }

paginator(){
  const offset=(this.currentPage-1)*this.pageSize
  this.projeService.getPaginatedProjects(this.pageSize,offset).subscribe({
    next:(res)=>{
      console.log(res)
        this.isLoading.set(false);
this.projects.set(res.body??[])

      const ContentRange=res.headers.get('Content-Range')
      console.log(ContentRange)
      if(ContentRange){
        this.totalItems=Number(ContentRange.split('/')[1]);
        this.totalPages=Math.ceil(this.totalItems/this.pageSize)

//         this.pages = Array.from(
//   { length: this.totalPages },
//   (_, i) => i + 1
// );
      }
    }
  })
}
changePage(page:number) {

  this.currentPage = page;

  this.paginator();

}


}
