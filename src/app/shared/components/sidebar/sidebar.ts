import { Component, inject, signal } from '@angular/core';
import {  RouterLink, RouterLinkActive } from '@angular/router';
import { Toastr } from '../success-toastr/service/toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isSidebarOpen = true;
  projId=signal("");
  toastService = inject(Toastr);
  router = inject(Router);
 


get projectId(): string | null {
  const url = this.router.url;
  const match = url.match(/^\/project\/([^/]+)/);
  
  return match ? match[1] : null;
}
 
 
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
