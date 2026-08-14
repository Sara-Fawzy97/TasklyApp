import { Injectable, signal } from '@angular/core';
import { Project } from '../../features/Projects/models/project';

@Injectable({
  providedIn: 'root',
})
export class Sharedservice {

selectedProject=signal<Project|null>(null)

}
