
import { Routes } from '@angular/router';
export const Projects_routes: Routes = [

 {
    path: '',
    loadComponent: () =>
      import('./components/list-projects/list-projects')
        .then(c => c.ListProjects)
  },
 {
    path: 'add',
    loadComponent: () =>
      import('./components/add-update-project/add-update-project')
        .then(c => c.AddUpdateProject)
  },
   {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/add-update-project/add-update-project')
        .then(c => c.AddUpdateProject)
  },
  {
    path: ':id',
    children:[
{
    path: 'epics',
    loadChildren: () =>
      import('../Epics/epics.routes')
        .then(m => m.Epics_routes)
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('../Tasks/tasks.routes')
        .then(m => m.Tasks_routes)
  },
  {
    path: 'members',
    loadChildren: () =>
      import('../Members/members.routes')
        .then(m => m.Members_routes)

  },
]
  },
];

