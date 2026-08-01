import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink,RouterLinkActive  } from '@angular/router';
import { Toastr } from '../../../core/services/toastr';
import { Router } from '@angular/router';
// import { Project } from '../../../features/Projects/models/project';
import { Sharedservice } from '../../services/sharedservice';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isSidebarOpen = true;
  route = inject(ActivatedRoute);
  projectId = '';
  toastService = inject(Toastr);
  router= inject(Router)
  sharedService=inject(Sharedservice)

  // private route = inject(ActivatedRoute);

ngOnInit() {

 this.router.events.subscribe(() => {

    const match = this.router.url.match(/project\/([^/]+)/);

    if (match) {
      // this.projectId = match[1];
       this.projectId = match ? match[1] : '';
    }

  });

}

  // ngOnInit() {
  //   this.projectId = this.route.firstChild?.firstChild?.firstChild?.snapshot.params['id'];
  //   // this.getOneProj()
  //   console.log(this.projectId);
  // }

//   ngOnInit() {
//   this.route.paramMap.subscribe(params => {
//     this.projectId = params.get('id')!;
//   });
// }
   
// ngAfterViewInit(){   
//    this.projectId = this.route.firstChild?.firstChild?.snapshot.params['id'];
// }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logOut(){
       sessionStorage.removeItem('accessToken')
     sessionStorage.removeItem('refreshToken')
     
     localStorage.removeItem('accessToken')
     localStorage.removeItem('refreshToken')
        this.toastService.success('Now You are logged out !','top-right');

        this.router.navigateByUrl('/project');

  }


    // getOneProj(project: Project) {
    //   this.sharedService.selectedProject.set(project);
    // }
}
