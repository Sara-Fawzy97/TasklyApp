import { DatePipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { EpicService } from '../../services/epic-service';
import { IEpicRes } from '../../models/IepicReq';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { EpicModal } from "../epic-modal/epic-modal";
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-all-epics',
  imports: [DatePipe, RouterLink, Pagination,EpicModal],
  templateUrl: './all-epics.html',
  styleUrl: './all-epics.css',
})

export class AllEpics {
  searchTerm = signal('');
  isLoading = signal(true);
  myDate: Date = new Date();
  epics = signal<IEpicRes[]>([]);
errorDisplayed=signal(false)
  showModal= signal(false);
  epicService = inject(EpicService);
  private destroyRef = inject(DestroyRef);
  projectId = ''
  toastService=inject(Toastr)
  route = inject(ActivatedRoute);


 pageSize = 6;
  currentPage = 1;
  totalItems = 0;
  totalPages = 1;
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

   //mobile only
  loadMore() {
    if (this.isLoading() || !this.hasMore) return;
    this.isLoading.set(true);
    this.currentPage++;
    this.paginator(true);
  }



  ngOnInit() {
      this.projectId = this.route.snapshot.params['id'];

     this.hasMore=true;
    this.paginator()

  }


epicID=''

  openModal(epicId:string){
      this.epicID=epicId
      this.showModal= signal(true);
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

  getEpics() {
    this.epicService
      .getAllEpics(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.epics.set(res);
        },
        error: (err) => {
          this.toastService.error(err.error.msg, 'top-right');
        },
      });
  }

  
 paginator(append = false) {
const term = this.searchTerm().trim();
    const offset = (this.currentPage - 1) * this.pageSize;

if(term){
  this.epicService.getSearchedEpics(
        this.projectId,
        term,
        offset,
        this.pageSize
      ).pipe(debounceTime(400),takeUntilDestroyed(this.destroyRef)).subscribe({
    next:(res)=>{
      console.log(res)
   this.epics.set(res.body??[])
    this.isLoading.set(false);

    const ContentRange = res.headers.get('Content-Range');
        if (ContentRange) {
          this.totalItems = Number(ContentRange.split('/')[1]);
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);

        }
    },
    error: (error) => {
      this.toastService.error(error.message,'top-right');
      this.toastService.error("Failed to search epics "+error.message,'top-right');
    },
  })}
      else{

        ////////without search
 this.epicService.getPaginatedProjects(this.pageSize, offset,this.projectId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (append) {

          this.epics.set([...this.epics(), ...(res.body ?? [])]);
        } else this.epics.set(res.body ?? []);
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
   
  }

  //for desktop
  changePage(page: number) {
    this.currentPage = page;

    this.paginator();
  }


closeModale(){
  this.getEpics()
   this.showModal= signal(false);
}
 


serchEpics(e:Event){
  this.currentPage=1

  //  const offset = (this.currentPage - 1) * this.pageSize;
  const term = (e.target as HTMLInputElement).value;
  this.searchTerm.set(term)

        this.paginator()

 
}



}
