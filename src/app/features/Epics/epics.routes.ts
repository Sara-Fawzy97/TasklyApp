// import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
// import { AddUpdateProject } from './components/add-update-project/add-update-project';
export const Epics_routes: Routes = [
//   { path: '', component: RecipesComponent },
//   { path: 'add', component: AddUpdateProject },
//   { path: 'update/:id', component: AddUpdateRecipesComponent },
 {
    path: '',
    loadComponent: () =>
      import('./components/all-epics/all-epics')
        .then(c => c.AllEpics)
  },
];

