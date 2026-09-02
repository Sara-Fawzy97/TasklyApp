import { Component, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import {CdkDrag,  CdkDragDrop,CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks-service';
import { Task } from '../../models/ITask';
import { TaskPopup } from '../task-popup/task-popup';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-all-tasks',
  imports: [DatePipe, TaskPopup, CdkDrag, CdkDropList],
  templateUrl: './all-tasks.html',
  styleUrl: './all-tasks.css',
})
export class AllTasks {
  currentPage = signal(1);
  isLoading = signal(true);

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
  dropListIds = this.statuses.map(status => `status-${status}`); //// ids for statuses cols
  projectId = '';
  searchTerm = signal('');
  today = new Date();
  myDate: Date = new Date();
  tasksByStatus = signal<Record<string, Task[]>>({});
  tasks = signal<Task[]>([]);
  showModal = signal(false);
  epicID = '';
  taskId = '';
  route = inject(ActivatedRoute);
  tasksService = inject(TasksService);
  router = inject(Router);
  private destroyRef = inject(DestroyRef);
  toastService = inject(Toastr);

  pageSize = 6;
  // currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  @ViewChild('loadMoreTrigger')
  loadMoreTrigger!: ElementRef;

  observer!: IntersectionObserver;
  hasMore = true;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    });
    this.observer.observe(this.loadMoreTrigger.nativeElement);
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];
    this.statuses.forEach((s) => {
      this.getTasks(s);
    });
    this.hasMore = true;
    // this.getAllTasks()
    this.paginator(true);
  }

  //mobile only
  loadMore() {
    if (this.isLoading() || !this.hasMore) return;
    this.isLoading.set(true);
    this.currentPage.update(page => page + 1);
    this.paginator(true);
  }

  paginator(append = false) {
    const term = this.searchTerm().trim();

    this.isLoading.set(true);

    if (term) {
     const offset = (this.currentPage() - 1) * this.pageSize;
      this.tasksService
        .getSearchedTasks(this.projectId, term, offset, this.pageSize)
        .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
             if (append) {
            this.tasks.set([
              ...this.tasks(),
              ...res.body??[]
            ]);}else{
          this.tasks.set(res.body??[])

            }

             this.statuses.forEach((status) => {
            this.tasksByStatus.update((current) => ({
              ...current,
              [status]: this.tasks().filter(
                task => task.status === status
              )
            }))})
            this.hasMore=true
            this.isLoading.set(false);

            if ((res.body?.length ?? 0) < this.pageSize) {
              this.hasMore = false;
            }
            const ContentRange = res.headers.get('Content-Range');
            if (ContentRange) {
              this.totalItems = Number(ContentRange.split('/')[1]);
              this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            }
          },
        });
    } else {
    const offset = (this.currentPage() - 1) * this.pageSize;

      this.tasksService
        .getPaginatedTasks(this.pageSize, offset, this.projectId)
        .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (append) {
              this.tasks.set([...this.tasks(), ...(res.body ?? [])]);
            } else this.tasks.set(res.body ?? []);

            this.isLoading.set(false);

            if ((res.body?.length ?? 0) < this.pageSize) {
              this.hasMore = false;
            }
            const ContentRange = res.headers.get('Content-Range');
            if (ContentRange) {
              this.totalItems = Number(ContentRange.split('/')[1]);
              this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            }
          },
          error: (error) => {
            this.toastService.error(error.message, 'top-right');
            this.toastService.error('Failed to search tasks ' + error.message, 'top-right');
          },
        });
    }
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

  getAllTasks() {
    this.tasksService.getAllTask(this.projectId).subscribe({
      next: (res) => {
        console.log(res);
        this.tasks.set(res);
      },
    });
  }

  navToTasks() {
    this.router.navigate(['/project/' + this.projectId + '/tasks/new']);
  }

  isToday(date: string) {
    return new Date(date).toDateString() === this.today.toDateString();
  }

  changeView(e: Event) {
    const selectElement = e.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        view: selectedValue,
      },
      queryParamsHandling: 'merge',
    });
  }

  openModal(taskId: string) {
    this.taskId = taskId;
    this.showModal = signal(true);
  }
  closeModale() {
    this.showModal = signal(false);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages!) {
      this.currentPage.set(this.currentPage() + 1);
      this.paginator();
    }
  }
  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.paginator();
    }
  }
  serchTasks(e: Event) {
    const term = (e.target as HTMLInputElement).value;
    this.currentPage.set(1);

    this.searchTerm.set(term);
    this.tasks.set([])
    this.hasMore=true

    this.paginator(false);
  }


   drop(event: CdkDragDrop<Task[]>,newStatus:string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }
    
     const task = event.previousContainer.data[event.previousIndex];
  const oldStatus = task.status;

    transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      task.status=newStatus

      this.tasksService.updateTaskStaus(task.id!,{status: newStatus}).subscribe({
        next:(res)=>{
          console.log(res)
        },
        error:(err)=>{
          console.log(err)
             task.status = oldStatus;
        },
      })

  }
}
