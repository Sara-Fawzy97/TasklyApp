import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/members-service';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-accept-invitation',
  imports: [],
  templateUrl: './accept-invitation.html',
  styleUrl: './accept-invitation.css',
})
export class AcceptInvitation {
 
  token=''
  isLoading="false"
route=inject(ActivatedRoute)
membersService=inject(MembersService)
toastService=inject(Toastr)
router=inject(Router)
  private destroyRef = inject(DestroyRef);


ngOnInit(){
this.token=this.route.snapshot.queryParamMap.get('token')||'';
console.log(this.token)

if(this.token){
sessionStorage.setItem('inviteToken',this.token)
}

const accessToken=sessionStorage.getItem('accessToken')

if(!accessToken){
  this.router.navigate(['/login'])
 
}



}



acceptInvitation(){
// const token=this.route.snapshot.queryParamMap.get('token');
  
const body={
    p_token:this.token 
  }

  this.membersService.recieveInvit(body).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    next:()=>{
      this.isLoading='true'
       this.toastService.success('Invitation accepted successfully','top-right');

    },
    error:(error)=>{
      this.isLoading='false'
      
       this.toastService.error(error.message,'top-right');
    },
    complete:()=>{
      sessionStorage.removeItem('inviteToken')
      this.router.navigateByUrl('/project')

    }
  })
}


}
