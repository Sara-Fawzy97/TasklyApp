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
}
