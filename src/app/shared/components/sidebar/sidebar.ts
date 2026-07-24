import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
 isSidebarOpen = true;
route = inject(ActivatedRoute);
projectId=0
ngOnInit() {
    this.projectId =  this.route.firstChild?.firstChild?.snapshot.params['id'];
    console.log(this.projectId);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
