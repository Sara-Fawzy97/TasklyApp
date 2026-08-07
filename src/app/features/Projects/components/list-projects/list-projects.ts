import { Component, inject, signal, AfterViewInit, ElementRef, ViewChild, DestroyRef } from '@angular/core';
import { Projects } from '../../services/projects';
import { Project } from '../../models/project';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list-projects',
  imports: [RouterLink, DatePipe, Pagination],
  templateUrl: './list-projects.html',
  styleUrl: './list-projects.css',
})
export class ListProjects implements AfterViewInit {
  projects = signal<Project[]>([]);
  myDate: Date = new Date();
  errorDisplayed = signal(false);
  isLoading = signal(false);
  projeService = inject(Projects);
  router = inject(Router);
  private destroyRef = inject(DestroyRef);

  pageSize = 6;
  currentPage = 1;
  totalItems = 0;
  totalPages = 1;

  @ViewChild('loadMoreTrigger')
  loadMoreTrigger!: ElementRef;

  observer!: IntersectionObserver;
  hasMore = true;


  ngOnInit() {
    this.hasMore = true;
    this.paginator();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    });
    this.observer.observe(this.loadMoreTrigger.nativeElement);
  }

  //mobile only
  loadMore() {
    if (this.isLoading() || !this.hasMore) return;
    this.isLoading.set(true);
    this.currentPage++;
    this.paginator(true);
  }

  // getProjects() {
  //   this.projeService.getProject().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
  //     next: (res) => {
  //       this.projects.set(res);
  //       this.isLoading.set(false);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       if (err.status === 401) {
  //         this.isLoading.set(false);
  //         this.router.navigateByUrl('/login');
  //       } else {
  //         this.errorDisplayed.set(true);
  //       }
  //     },
      
  //   });
  // }

  getOneProj(project: Project) {
    this.projeService.selectedProject.set(project);
    this.router.navigate(['project/' + project.id + '/edit']);
    
  }

  paginator(append = false) {
    this.isLoading.set(false);

    const offset = (this.currentPage - 1) * this.pageSize;
    this.projeService.getPaginatedProjects(this.pageSize, offset).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (append) {
          this.projects.set([...this.projects(), ...(res.body ?? [])]);
        } else this.projects.set(res.body ?? []);

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
      error: () => {
          this.errorDisplayed.set(true);
      },
    });
  }

  //for desktop
  changePage(page: number) {
    this.currentPage = page;

    this.paginator(false);
  }
}
