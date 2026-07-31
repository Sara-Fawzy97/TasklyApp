import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEpic } from '../models/IepicReq';

@Injectable({
  providedIn: 'root',
})
export class EpicService {

  private http= inject(HttpClient)

  createEpic(data:IEpic){
     return this.http.post('/rest/v1/epics',data)

  }
}
