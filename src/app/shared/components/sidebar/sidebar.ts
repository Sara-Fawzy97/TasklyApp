import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink,RouterLinkActive  } from '@angular/router';
import { Toastr } from '../../../core/services/toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isSidebarOpen = true;
  route = inject(ActivatedRoute);
  projectId = 0;
  toastService = inject(Toastr);
  router= inject(Router)

  ngOnInit() {
    this.projectId = this.route.firstChild?.firstChild?.snapshot.params['id'];
    // console.log(this.projectId);
  }
   
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
}
