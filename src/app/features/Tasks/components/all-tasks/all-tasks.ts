import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../../services/tasks-service';
import { Task } from '../../models/ITask';

@Component({
  selector: 'app-all-tasks',
  imports: [],
  templateUrl: './all-tasks.html',
  styleUrl: './all-tasks.css',
})
export class AllTasks {

statuses=['TO DO','IN PROGRESS','BLOCKED','IN REVIEW','READY FOR QA','REOPENED','READY FOR PRODUCTION','DONE']
projectId=''
tasks=signal<Task[]>([])
   route = inject(ActivatedRoute);
tasksService=inject(TasksService)


ngOnInit(){
  this.projectId = this.route.snapshot.params['id']
  // this.getTasks('TO DO')

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




}
