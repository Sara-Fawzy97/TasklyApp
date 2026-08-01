import { Component, inject, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Projects } from '../../services/projects';
import { Project } from '../../models/project';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-list-projects',
  imports: [RouterLink, DatePipe, Pagination],
  templateUrl: './list-projects.html',
  styleUrl: './list-projects.css',
})
export class ListProjects implements AfterViewInit {
  projects = signal<Project[]>([]);
  myDate: Date = new Date();
  projeService = inject(Projects);
  router = inject(Router);
  errorDisplayed = signal(false);
  isLoading = signal(false);

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  totalPages = 1;

  @ViewChild('loadMoreTrigger')
  loadMoreTrigger!: ElementRef;

  observer!: IntersectionObserver;

  hasMore = true;

  ngOnInit() {
    // this.getProjects();\
    this.hasMore = true;
    this.paginator();
  }

  ngAfterViewInit() {
    // console.log(this.loadMoreTrigger);
    // console.log('AfterViewInit');
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        //  console.log('Visible');
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

  getProjects() {
    this.projeService.getProject().subscribe({
      next: (res) => {
        // console.log(res);
        this.projects.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 401) {
          this.isLoading.set(false);
          this.router.navigateByUrl('/login');
        } else {
          this.errorDisplayed.set(true);
        }
      },
      complete: () => {
        // this.isLoading.set(false)
      },
    });
  }

  getOneProj(project: Project) {
    this.projeService.selectedProject.set(project);
    this.router.navigate(['project/' + project.id + '/edit']);
  }

  paginator(append = false) {
    this.isLoading.set(false);

    const offset = (this.currentPage - 1) * this.pageSize;
    this.projeService.getPaginatedProjects(this.pageSize, offset).subscribe({
      next: (res) => {
        console.log(res);
        if (append) {
          this.projects.set([...this.projects(), ...(res.body ?? [])]);
        } else this.projects.set(res.body ?? []);

        this.isLoading.set(false);

        if ((res.body?.length ?? 0) < this.pageSize) {
          this.hasMore = false;
        }
        const ContentRange = res.headers.get('Content-Range');
        // console.log(ContentRange)
        if (ContentRange) {
          this.totalItems = Number(ContentRange.split('/')[1]);
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);

          //         this.pages = Array.from(
          //   { length: this.totalPages },
          //   (_, i) => i + 1
          // );
        }
      },
      error: (err) => {
        console.log(err);
        if (err.status === 401) {
          this.isLoading.set(false);
          this.router.navigateByUrl('/login');
        } else {
          this.errorDisplayed.set(true);
        }
      },
    });
  }

  //for desktop
  changePage(page: number) {
    this.currentPage = page;

    this.paginator(false);
  }
}
