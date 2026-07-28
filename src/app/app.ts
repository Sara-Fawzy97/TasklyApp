import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SuccessToastr } from "./shared/components/success-toastr/success-toastr";
import { Toastr } from './core/services/toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SuccessToastr],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TasklyApp');
  toastService = inject(Toastr);

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
}else{
        this.toastService.error('Invalid or expired reset link. !','top-right');
  
}
  });
}
}
