import { Component, inject} from '@angular/core';
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

// ngOnInit() {

// this.getProjectID()
// }

get showProjectSidebar() {
  return /^\/project\/[^/]+/.test(this.router.url);
}

// getProjectID(){
//    this.router.events.subscribe(() => {

//     const match = this.router.url.match(/project\/([^/]+)/);

//     if (match) {
//       // this.projectId = match[1];
//        this.projectId=(match ? match[1] : ' ');
//     }

//   });
// }
  

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logOut(){
     
     localStorage.removeItem('accessToken')
     localStorage.removeItem('refreshToken')
        this.toastService.success('Now You are logged out !','top-right');

        this.router.navigateByUrl('/project');

  }


  
}
