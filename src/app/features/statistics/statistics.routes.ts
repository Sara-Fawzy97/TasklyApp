
import { Routes } from '@angular/router';
export const Statistics_routes: Routes = [

 {
    path: '',
    loadComponent: () =>
      import('./statistics')
        .then(c => c.Statistics)
  },
]