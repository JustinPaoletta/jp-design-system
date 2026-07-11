import { Route } from '@angular/router';
import { Phase2DashboardPage } from './pages/phase-2-dashboard/phase-2-dashboard.page';
import { Phase3DashboardPage } from './pages/phase-3-dashboard/phase-3-dashboard.page';
import { Phase4ControlsPage } from './pages/phase-4-controls/phase-4-controls.page';
import { Phase5DataPage } from './pages/phase-5-data/phase-5-data.page';
import { Phase6OverlaysPage } from './pages/phase-6-overlays/phase-6-overlays.page';
import { Phase7AssistantPage } from './pages/phase-7-assistant/phase-7-assistant.page';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'phase-7-assistant',
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
  {
    path: 'phase-6-overlays',
    component: Phase6OverlaysPage,
  },
  {
    path: 'phase-7-assistant',
    component: Phase7AssistantPage,
  },
];
