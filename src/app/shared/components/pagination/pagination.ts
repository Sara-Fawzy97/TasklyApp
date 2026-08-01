import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {

  currentPage=input.required<number>()
  totalPages=input.required<number>()
  totalItems=input.required <number>()
  // projects=input.required <Project[]>()
  projectsNums=input.required <number>()
  pageNum=output<number>()
  

   get pages(): number[] {
    return Array.from(
      { length: this.totalPages()?? 0 },
      (_, i) => i + 1
    );
  }

goToPage(page: number) {
  this.pageNum.emit(page)
}

nextPage(){
if (this.currentPage() < this.totalPages()!) {
    this.pageNum.emit(this.currentPage() +1)
  }
}
prevPage(){
if (this.currentPage() > 1) {
    this.pageNum.emit(this.currentPage()-1)
  }
}

}
