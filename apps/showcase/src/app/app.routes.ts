import { Route } from '@angular/router';
import { ShellLayout } from './layout/shell-layout';
import { LayoutDashboardPage } from './pages/layout-dashboard/layout-dashboard.page';
import { AppShellPage } from './pages/app-shell/app-shell.page';
import { ControlsPage } from './pages/controls/controls.page';
import { OverlaysPage } from './pages/overlays/overlays.page';
import { AssistantPage } from './pages/assistant/assistant.page';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellLayout,
    children: [
      {
        path: 'advanced-layout',
        loadComponent: () =>
          import('./pages/advanced-layout/advanced-layout.page').then(
            (module) => module.AdvancedLayoutPage,
          ),
      },
      {
        path: 'workflows',
        loadComponent: () =>
          import('./pages/workflows/workflows.page').then(
            (module) => module.WorkflowsPage,
          ),
      },
      {
        path: 'product-tools',
        loadComponent: () =>
          import('./pages/product-tools/product-tools.page').then(
            (module) => module.ProductToolsPage,
          ),
      },
      {
        path: 'product-recipes',
        loadComponent: () =>
          import('./pages/product-recipes/product-recipes.page').then(
            (module) => module.ProductRecipesPage,
          ),
      },
      {
        path: 'component-expansion',
        loadComponent: () =>
          import('./pages/component-expansion/component-expansion.page').then(
            (module) => module.ComponentExpansionPage,
          ),
      },
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
        loadComponent: () =>
          import('./pages/data/data.page').then((module) => module.DataPage),
      },
      {
        path: 'overlays',
        component: OverlaysPage,
      },
      {
        path: 'assistant',
        component: AssistantPage,
      },
    ],
  },
];
