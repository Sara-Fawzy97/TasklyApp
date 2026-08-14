import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../models/ITask';

@Injectable({
  providedIn: 'root',
})
export class TasksService {

private http= inject(HttpClient)


  getProjTasks(projectId:string,status:string){
    return this.http.get<Task[]>(`/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`)
  }
}
