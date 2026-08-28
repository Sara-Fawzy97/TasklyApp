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
  

   get pages() :(string |number)[] {

    if(this.totalPages()<=5){
    return Array.from(
      { length: this.totalPages() },
      (_, i) => i + 1
    );}

    if(this.currentPage()<=3 ){
    return [1,2,3,4,'...',this.totalPages()]
    }
      if( this.currentPage() >= this.totalPages() - 2){
           return [1, '...', this.totalPages() - 3, this.totalPages() - 2, this.totalPages() - 1,this.totalPages()];
      }
   return [1,'...',this.currentPage() - 1, this.currentPage(),this.currentPage() + 1,'...',this.totalPages()];
  }

goToPage(page: number|string) {

  if (typeof page !== 'number') {
      return;
    }
    // this.currentPage=page
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
