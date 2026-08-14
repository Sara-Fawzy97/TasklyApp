import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../models/ITask';

@Injectable({
  providedIn: 'root',
})
export class TasksService {

private http= inject(HttpClient)


  createTasks(data:Task){
    return this.http.post('/rest/v1/tasks',data)


  }


  getProjTasks(projectId:string){
    return this.http.get(`/rest/v1/project_tasks?project_id=eq.${projectId}`)
  }


}
