import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../../services/tasks-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-all-tasks',
  imports: [],
  templateUrl: './all-tasks.html',
  styleUrl: './all-tasks.css',
})
export class AllTasks {

    private route = inject(ActivatedRoute);
  projectId = '';
  taskService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  

  ngOnInit(){
    this.projectId = this.route.snapshot.paramMap.get('id')!;
this.getAllTasks()
  }

  getAllTasks(){
this.taskService.getProjTasks(this.projectId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
  next:(res)=>{
console.log(res)
  }
})
  }
}
