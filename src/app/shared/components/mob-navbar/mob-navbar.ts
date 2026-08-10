import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-mob-navbar',
  imports: [RouterLink],
  templateUrl: './mob-navbar.html',
  styleUrl: './mob-navbar.css',
})
export class MobNavbar {
  router = inject(Router);
  route = inject(ActivatedRoute);

get showProjectSidebar() {
    return /^\/project\/[^/]+/.test(this.router.url);
  }


get projectId(): string | null {
  const url = this.router.url;
  const match = url.match(/^\/project\/([^/]+)/);
  
  return match ? match[1] : null;
}
 


}
