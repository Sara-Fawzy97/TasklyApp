import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IMember, Invitation } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {

private http=inject(HttpClient)

getProjMembers(id:string){
 return this.http.get<IMember[]>(`/rest/v1/get_project_members?project_id=eq.${id}`)
}

sendInvit(data:Invitation){

  return this.http.post('/rest/v1/rpc/invite_member',data)
}

reciveInvit(token:string){
return this.http.post('/rest/v1/rpc/accept_invitation',token)
}

}
