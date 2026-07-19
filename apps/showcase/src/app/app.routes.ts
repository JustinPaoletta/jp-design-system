import { Route } from '@angular/router';
import { LayoutDashboardPage } from './pages/layout-dashboard/layout-dashboard.page';
import { AppShellPage } from './pages/app-shell/app-shell.page';
import { ControlsPage } from './pages/controls/controls.page';
import { DataPage } from './pages/data/data.page';
import { OverlaysPage } from './pages/overlays/overlays.page';
import { AssistantPage } from './pages/assistant/assistant.page';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'assistant',
  },
  {
    path: 'layout-dashboard',
    component: LayoutDashboardPage,
  },
  {
    path: 'app-shell',
    component: AppShellPage,
  },
  {
    path: 'controls',
    component: ControlsPage,
  },
  {
    path: 'data',
    component: DataPage,
  },
  {
    path: 'overlays',
    component: OverlaysPage,
  },
  {
    path: 'assistant',
    component: AssistantPage,
  },
];
