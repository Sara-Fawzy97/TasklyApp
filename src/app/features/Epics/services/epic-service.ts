import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEpic, IEpicRes } from '../models/IepicReq';

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
// {{base_url}}/rest/v1/project_epics?project_id=eq.298be621-59c7-4a62-ad2c-e640ff72135f&id=eq.5360f7b4-5be0-4ca0-b0cc-31bff72434dd
  getEpicDetails(projectId:string,epicId:string){

  return this.http.get<IEpicRes[]>(`/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`)
  }
}
