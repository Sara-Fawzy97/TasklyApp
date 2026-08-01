import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IMember } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {


private http=inject(HttpClient)

getProjMembers(id:string){
 return this.http.get<IMember[]>(`/rest/v1/get_project_members?project_id=eq.${id}`)
}

}
