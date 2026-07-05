import { Route } from '@angular/router';
import { Phase2DashboardPage } from './pages/phase-2-dashboard/phase-2-dashboard.page';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'phase-2-dashboard',
  },
  {
    path: 'phase-2-dashboard',
    component: Phase2DashboardPage,
  },
];
