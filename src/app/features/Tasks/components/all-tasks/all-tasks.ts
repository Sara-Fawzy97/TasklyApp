import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks-service';
import { Task } from '../../models/ITask';

@Component({
  selector: 'app-all-tasks',
  imports: [DatePipe],
  templateUrl: './all-tasks.html',
  styleUrl: './all-tasks.css',
})
export class AllTasks {
  statuses = [
    'TO_DO',
    'IN_PROGRESS',
    'BLOCKED',
    'IN_REVIEW',
    'READY_FOR_QA',
    'REOPENED',
    'READY_FOR_PRODUCTION',
    'DONE',
  ];
  projectId = '';  
  today = new Date()
  myDate: Date = new Date();
  tasksByStatus = signal<Record<string, Task[]>>({});
  tasks=signal<Task[]>([])

  route = inject(ActivatedRoute);
  tasksService = inject(TasksService);
  router = inject(Router);


  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
    this.statuses.forEach((s) => {
      this.getTasks(s);
    });
    this.getAllTasks()
  }

  value = '';
  getInitials(name: string) {
    if (!name) return '';

    const words = name.trim().split('');

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  gettasksByStatus(status: string): Task[] {
    return this.tasksByStatus()[status] ?? [];
  }

  getTasks(status: string) {
    this.tasksService.getProjTasks(this.projectId, status).subscribe({
      next: (res) => {
        this.tasksByStatus.update((current) => ({
          ...current,
          [status]: res,
        }));
      },
    });
  }

  getAllTasks(){
    this.tasksService.getAllTask(this.projectId).subscribe({
      next:(res)=>{
        console.log(res)
this.tasks.set(res)
      }
    })
  }

  navToTasks() {
    this.router.navigate(['/project/' + this.projectId + '/tasks/new']);
  }

  isToday(date:string){
return new Date(date).toDateString() === this.today.toDateString()
  }

  changeView(e:Event){
     const selectElement = e.target as HTMLSelectElement
     const selectedValue=selectElement.value

     this.router.navigate([],{
         relativeTo:this.route,
            queryParams:{
              view:selectedValue
            },
            queryParamsHandling:'merge'
     })

  }
}
