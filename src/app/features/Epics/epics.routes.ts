// import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
export const Epics_routes: Routes = [
 {
    path: '',
    loadComponent: () =>
      import('./components/all-epics/all-epics')
        .then(c => c.AllEpics)
  }, {
    path: 'new',
    loadComponent: () =>
      import('./components/add-epic/add-epic')
        .then(c => c.AddEpic)
  },
];

