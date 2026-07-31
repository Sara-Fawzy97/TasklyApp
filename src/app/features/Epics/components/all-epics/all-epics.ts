import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { EpicService } from '../../services/epic-service';
import { IEpicRes } from '../../models/IepicReq';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-epics',
  imports: [DatePipe,RouterLink],
  templateUrl: './all-epics.html',
  styleUrl: './all-epics.css',
})
export class AllEpics {

    epics = signal<IEpicRes[]>([]);
  
    isLoading = signal(true);
  myDate: Date = new Date();



ngOnInit(){
  this.getEpics()
}

  value=''
  getInitials(name: string) {
  if (!name) return '';

  const words = name.trim().split('');

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

return  (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
}
  route = inject(ActivatedRoute);
  
epicService=inject(EpicService)

getEpics(){
 const projectId = this.route.snapshot.params['id'];

this.epicService.getAllEpics(projectId).subscribe({
  next:(res)=>{
        this.isLoading.set(false);
    this.epics.set(res)
    console.log(res)
  }
})
}

}