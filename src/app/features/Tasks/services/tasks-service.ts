import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getProjTasks(projectId:string,status:string){
    return this.http.get<Task[]>(`/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`)
  }

  getAllTask(projectId:string){
    return this.http.get<Task[]>(`/rest/v1/project_tasks?project_id=eq.${projectId}`)
  }


  getTaskDetails(projectId:string, taskId:string){
    return this.http.get<Task[]>(`/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`)
  }

   getPaginatedTasks(limit:number,offset:number,projectId:string){
  return this.http.get<Task[]>( `/rest/v1/project_tasks?project_id=eq.${projectId}&limit=${limit}&offset=${offset}
`,{
    headers:new HttpHeaders({Prefer:`count=exact`}),
     observe: 'response'
  })
}

// GET /rest/v1/project_tasks?project_id=eq.{PROJECT_ID}&title=ilike.%25{SEARCH_TERM}%25
 getSearchedTasks(PROJECT_ID:string,SEARCH_TERM?:string,offset?:number,limit?: number){
    
    return this.http.get<Task[]>(`/rest/v1/project_tasks?project_id=eq.${PROJECT_ID}&title=ilike.%25${SEARCH_TERM}%25&offset=${offset}&limit=${limit}`,
      {
    headers:new HttpHeaders({Prefer:`count=exact`}),
     observe: 'response'
  }
    )
  }


}
