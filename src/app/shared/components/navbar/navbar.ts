import { Component, inject, OnInit, signal} from '@angular/core';
import { Auth } from '../../../features/Auth/services/auth';
import { Router } from '@angular/router';
import { Toastr } from '../../../core/services/toastr';


@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  authService = inject(Auth);
  toastService = inject(Toastr);
  
   router=inject(Router)
  
  userName =signal("");
  jobTitle = signal('');

  logOutDisplay=false

  avatarClicked(){
    this.logOutDisplay=!this.logOutDisplay;
    console.log(this.logOutDisplay)
  }

  ngOnInit() {
    this.getUserInfo();
    
  }

  getUserInfo() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.userName.set(res.user_metadata.name)
        this.jobTitle.set(res.user_metadata.department)
        console.log(this.userName())
        console.log(res);
      },
    });
  }

  value=''
  getInitials(name: string) {
  if (!name) return '';

  const words = name.trim().split('');

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

return  (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
}

errorMsg=''
logOut(){
  this.authService.logOut().subscribe({
    next:()=>{
     
     localStorage.removeItem('accessToken')
     localStorage.removeItem('refreshToken')
        this.toastService.success('Now You are logged out !','top-right');

    },
    error:()=>{
        this.toastService.error('Somthing went Wrong !','top-right');

      this.errorMsg='Logout failed, please try again.'
    },
    complete:()=>{
   
    this.router.navigateByUrl('/login');
    
    }
  })
}
}
