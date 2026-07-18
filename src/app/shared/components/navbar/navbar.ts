import { Component, inject, OnInit} from '@angular/core';
import { Auth } from '../../../features/Auth/services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  authService = inject(Auth);
   router=inject(Router)
  
  userName ="";
  jobTitle = '';

  logOutDisplay=false

  avatarClicked(){
    this.logOutDisplay=!this.logOutDisplay;
    console.log(this.logOutDisplay)
  }

  ngOnInit() {
    this.getUserInfo();
    // this.getInitials(this.userName)
    
  }

  getUserInfo() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.userName=res.user_metadata.name
        this.jobTitle=res.user_metadata.department
        console.log(this.userName)
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
    next:(res)=>{
      console.log(res)
    },
    error:(err)=>{
      this.errorMsg='Logout failed, please try again.'
      console.log(err)

    },
    complete:()=>{
     localStorage.clear()
    this.router.navigateByUrl('/login');
    
    }
  })
}
}
