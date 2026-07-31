import { Component, inject, signal } from '@angular/core';
import { MembersService } from '../../services/members-service';
import { Toastr } from '../../../../core/services/toastr';

@Component({
  selector: 'app-members',
  imports: [],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members {

  memberService= inject(MembersService)
  isLoading = signal(true);
  toastrService = inject(Toastr);
  errorDisplayed = signal(false);


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

ngOnInit(){
  this.getMembers()
}
getMembers(){
this.memberService.getProjMembers('298be621-59c7-4a62-ad2c-e640ff72135f').subscribe({
  next:(res)=>{
    console.log(res)
    this.isLoading.set(false)
  },error:(err)=>{
    this.isLoading.set(false)
        this.toastrService.error("Failed to load project members. Please try again.", 'top-right');
        this.toastrService.error(err.error.message, 'top-right');
          this.errorDisplayed.set(true);
    
  }
})
}

}
