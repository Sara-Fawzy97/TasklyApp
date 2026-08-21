import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/members-service';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';

@Component({
  selector: 'app-accept-invitation',
  imports: [],
  templateUrl: './accept-invitation.html',
  styleUrl: './accept-invitation.css',
})
export class AcceptInvitation {
 
  isLoading="false"
route=inject(ActivatedRoute)
membersService=inject(MembersService)
toastService=inject(Toastr)
router=inject(Router)


acceptInvitation(){
const token=this.route.snapshot.queryParamMap.get('token');
  
const body={
    p_token:token 
  }

  this.membersService.recieveInvit(body).subscribe({
    next:()=>{
      this.isLoading='true'
       this.toastService.success('Invitation is accepted','top-right');

      this.router.navigateByUrl('/project')
    },
    error:(error)=>{
      this.isLoading='false'
      
       this.toastService.error(error.message,'top-right');
    }
  })
}


}
