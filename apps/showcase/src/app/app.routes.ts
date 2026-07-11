import { Route } from '@angular/router';
import { Phase2DashboardPage } from './pages/phase-2-dashboard/phase-2-dashboard.page';
import { Phase3DashboardPage } from './pages/phase-3-dashboard/phase-3-dashboard.page';
import { Phase4ControlsPage } from './pages/phase-4-controls/phase-4-controls.page';
import { Phase5DataPage } from './pages/phase-5-data/phase-5-data.page';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'phase-5-data',
  },
  {
    path: 'phase-2-dashboard',
    component: Phase2DashboardPage,
  },
  {
    path: 'phase-3-dashboard',
    component: Phase3DashboardPage,
  },
  {
    path: 'phase-4-controls',
    component: Phase4ControlsPage,
  },
  {
    path: 'phase-5-data',
    component: Phase5DataPage,
  },
];
