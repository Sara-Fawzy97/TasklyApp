import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Projects } from '../../../features/Projects/services/projects';

@Component({
  selector: 'app-mob-navbar',
  imports: [RouterLink],
  templateUrl: './mob-navbar.html',
  styleUrl: './mob-navbar.css',
})
export class MobNavbar {
  router = inject(Router);
  route = inject(ActivatedRoute);
  projectId =''
projeService = inject(Projects);

get showProjectSidebar() {
    return /^\/project\/[^/]+/.test(this.router.url);
  }




}
