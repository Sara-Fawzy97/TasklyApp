import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TasklyApp');

  private readonly route=inject(ActivatedRoute)
  private readonly router=inject(Router)

  ngOnInit() {
    
  this.route.fragment.subscribe(fragment => {
    // console.log(fragment);
     if (!fragment) return;
const params = new URLSearchParams(fragment);

const accessToken = params.get('access_token');
// const refreshToken = params.get('refresh_token');
const type = params.get('type');
    
if(type==='recovery' &&accessToken){
  this.router.navigate(['/reset-password'],{
    queryParams:{
      access_token:accessToken}
  })
}
  });
}
}
