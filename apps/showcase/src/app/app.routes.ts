import { Route } from '@angular/router';
import { ShellLayout } from './layout/shell-layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellLayout,
    children: [
      {
        path: 'hierarchy',
        loadComponent: () =>
          import('./pages/hierarchy/hierarchy.page').then(
            (m) => m.HierarchyPage,
          ),
      },
      {
        path: 'scheduling',
        loadComponent: () =>
          import('./pages/scheduling/scheduling.page').then(
            (m) => m.SchedulingPage,
          ),
      },
      {
        path: 'interaction-tools',
        loadComponent: () =>
          import('./pages/interaction-tools/interaction-tools.page').then(
            (m) => m.InteractionToolsPage,
          ),
      },
      {
        path: 'data-performance',
        loadComponent: () =>
          import('./pages/data-performance/data-performance.page').then(
            (m) => m.DataPerformancePage,
          ),
      },
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
        loadComponent: () =>
          import('./pages/layout-dashboard/layout-dashboard.page').then(
            (m) => m.LayoutDashboardPage,
          ),
      },
      {
        path: 'app-shell',
        loadComponent: () =>
          import('./pages/app-shell/app-shell.page').then(
            (m) => m.AppShellPage,
          ),
      },
      {
        path: 'controls',
        loadComponent: () =>
          import('./pages/controls/controls.page').then((m) => m.ControlsPage),
      },
      {
        path: 'data',
        loadComponent: () =>
          import('./pages/data/data.page').then((module) => module.DataPage),
      },
      {
        path: 'overlays',
        loadComponent: () =>
          import('./pages/overlays/overlays.page').then((m) => m.OverlaysPage),
      },
      {
        path: 'assistant',
        loadComponent: () =>
          import('./pages/assistant/assistant.page').then(
            (m) => m.AssistantPage,
          ),
      },
    ],
  },
];
