import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IEpic, IEpicRes } from '../models/IepicReq';
import { Task } from '../../Tasks/models/ITask';

@Injectable({
  providedIn: 'root',
})
export class EpicService {

  private http= inject(HttpClient)

  createEpic(data:IEpic){
     return this.http.post('/rest/v1/epics',data)

  }

  getAllEpics(projectId:string){
    return this.http.get<IEpicRes[]>('/rest/v1/project_epics?project_id=eq.'+projectId)
  }

    getPaginatedProjects(limit:number,offset:number,projectId:string){
  return this.http.get<IEpicRes[]>( `/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}
`,{
    headers:new HttpHeaders({Prefer:`count=exact`}),
     observe: 'response'
  })
}
// {{base_url}}/rest/v1/project_epics?project_id=eq.298be621-59c7-4a62-ad2c-e640ff72135f&id=eq.5360f7b4-5be0-4ca0-b0cc-31bff72434dd
  getEpicDetails(projectId:string,epicId:string){

  return this.http.get<IEpicRes[]>(`/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`)
  }

  updateEpic(epicId:string,data:Partial<IEpic>){
   return this.http.patch(`/rest/v1/epics?id=eq.${epicId}`,data)
  }

  getEpicTasks(epicId:string){
    return this.http.get<Task[]>(`/rest/v1/project_tasks?epic_id=eq.${epicId}`)
  }
  selectecEpic=signal<IEpicRes|null>(null)

}
