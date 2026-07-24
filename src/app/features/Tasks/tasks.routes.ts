// import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
// import { AddUpdateProject } from './components/add-update-project/add-update-project';
export const Tasks_routes: Routes = [
 {
    path: '',
    loadComponent: () =>
      import('./components/all-tasks/all-tasks')
        .then(c => c.AllTasks)
  },
];

