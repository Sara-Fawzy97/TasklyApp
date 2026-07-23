import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class Projects {
  private http=inject(HttpClient)

addNew(data:Project){
return this.http.post('/rest/v1/projects',data)

}


}
