import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TasksCount, TaskState } from '../modals/IStatistic';
// import { Statistic } from '../modals/IStatistic';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private http=inject(HttpClient)


getTasksInRange(start:string,end:string,projId:string|null=null,status:string|null=null){
  return this.http.post<TaskState>('/rest/v1/rpc/get_tasks_calendar_stats',{p_start_date:start,p_end_date:end,  p_project_id:projId, 
  p_status:status})
}
  
  getTasksPerProj(start:string,end:string){
return this.http.post<TasksCount[]>('/rest/v1/rpc/get_tasks_count_per_project',{ p_start_date:start,  p_end_date:end})
  }
}
