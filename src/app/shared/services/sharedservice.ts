import { Injectable, signal } from '@angular/core';
import { Project } from '../../features/Projects/models/project';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Sharedservice {

selectedProject=signal<Project|null>(null)

 public spinner$: Subject<boolean>

  constructor() {
    this.spinner$ = new Subject<boolean>();
  }

  showSpinner() {
    this.spinner$.next(true);
  }

  hideSpinner() {
    this.spinner$.next(false);
  }
}
