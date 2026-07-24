// import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
// import { AddUpdateProject } from './components/add-update-project/add-update-project';
export const Members_routes: Routes = [
 {
    path: '',
    loadComponent: () =>
      import('./components/members/members')
        .then(c => c.Members)
  },
];

