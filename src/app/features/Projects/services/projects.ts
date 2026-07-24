import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class Projects {
  private http=inject(HttpClient)

addNew(data:Project){
return this.http.post('/rest/v1/projects',data)

}
getProject(){
  return this.http.get<Project[]>('/rest/v1/rpc/get_projects')
}

updateProject(data:Project,id:number){
  return this.http.patch('/rest/v1/projects?id=eq.'+id,data)
}
selectedProject=signal<Project|null>(null)


}
