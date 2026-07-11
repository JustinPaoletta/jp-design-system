import { Route } from '@angular/router';
import { Phase2DashboardPage } from './pages/phase-2-dashboard/phase-2-dashboard.page';
import { Phase3DashboardPage } from './pages/phase-3-dashboard/phase-3-dashboard.page';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'phase-3-dashboard',
  },
  {
    path: 'phase-2-dashboard',
    component: Phase2DashboardPage,
  },
  {
    path: 'phase-3-dashboard',
    component: Phase3DashboardPage,
  },
];
