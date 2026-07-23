// import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
// import { AddUpdateProject } from './components/add-update-project/add-update-project';
export const Projects_routes: Routes = [
//   { path: '', component: RecipesComponent },
//   { path: 'add', component: AddUpdateProject },
//   { path: 'update/:id', component: AddUpdateRecipesComponent },
 {
    path: 'add',
    loadComponent: () =>
      import('./components/add-update-project/add-update-project')
        .then(c => c.AddUpdateProject)
  },
];

