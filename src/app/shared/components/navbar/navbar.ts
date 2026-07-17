import { Component, inject } from '@angular/core';
import { Auth } from '../../../features/Auth/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

userName=localStorage.getItem('userName')
jobTitle=localStorage.getItem("jobTitle")

  authService=inject(Auth)



  getUserInfo(){
    this.authService.getProfile().subscribe({
      next:()=>{
        console.log()
      }
    })
  }
}


