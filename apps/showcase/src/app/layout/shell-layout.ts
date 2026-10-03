import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { JpAppShell, JpAppShellNavItem, JpStack } from '@jp-design-system/ui';

/**
 * Shared shell for all showcase pages. Navigation goes through the Angular
 * Router (no full page reloads), so sidebar state persists across pages.
 */
@Component({
  selector: 'app-shell-layout',
  imports: [RouterOutlet, JpAppShell, JpAppShellNavItem, JpStack],
  templateUrl: './shell-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellLayout {
  private readonly router = inject(Router);

  sidebarCollapsed = false;
  mobileNavOpen = false;

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  isActive(path: string): boolean {
    return this.currentUrl().split(/[?#]/)[0] === path;
  }

  onNavClick(event: Event, path: string): void {
    event.preventDefault();
    this.router.navigateByUrl(path);
    this.mobileNavOpen = false;
  }
}
