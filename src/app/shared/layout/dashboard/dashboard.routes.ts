import { Routes } from '@angular/router';
// import { AddUpdateProject } from './components/add-update-project/add-update-project';
export const Dashboard_routes: Routes = [
//   { path: '', component: RecipesComponent },
 {
    path: '',
    loadComponent: () =>
      import('./dashboard')
        .then(c => c.Dashboard)
,  children: [

{
    path: 'project',
    loadChildren: () =>
      import('../../../features/Projects/projects.routes')
        .then(m => m.Projects_routes)
  },
]}
];
