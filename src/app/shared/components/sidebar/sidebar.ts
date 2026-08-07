import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Toastr } from '../success-toastr/service/toastr';
import { Router } from '@angular/router';
// import { Project } from '../../../features/Projects/models/project';
import { Sharedservice } from '../../services/sharedservice';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isSidebarOpen = true;
  route = inject(ActivatedRoute);

  projectId = this.route.snapshot.params['id'];
  toastService = inject(Toastr);
  router = inject(Router);
  sharedService = inject(Sharedservice);

 
  get showProjectSidebar() {
    return /^\/project\/[^/]+/.test(this.router.url);
  }

  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.toastService.success('Now You are logged out !', 'top-right');

    this.router.navigateByUrl('/project');
  }
}
