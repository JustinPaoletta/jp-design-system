import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { getFocusableElements } from '../shared/focus-trap';

const SHELL_MOBILE_MEDIA = '(max-width: 48rem)';

@Component({
  selector: 'jp-app-shell',
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-app-shell',
    '[class.jp-app-shell--collapsed]': 'sidebarCollapsed()',
    '[class.jp-app-shell--mobile-nav-open]': 'mobileNavOpen()',
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export class JpAppShell implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly sidebarRef =
    viewChild<ElementRef<HTMLElement>>('sidebarPanel');
  private readonly menuToggleRef =
    viewChild<ElementRef<HTMLButtonElement>>('menuToggle');

  private previousFocus: HTMLElement | null = null;
  private lastMobileNavOpen = false;
  private mobileMediaQuery: MediaQueryList | null = null;

  readonly sidebarId = 'jp-app-shell-sidebar';
  readonly isMobileViewport = signal(false);

  readonly sidebarCollapsed = input(false, { transform: booleanAttribute });
  readonly mobileNavOpen = input(false, { transform: booleanAttribute });
  readonly sidebarLabel = input('Primary');

  readonly sidebarCollapsedChange = output<boolean>();
  readonly mobileNavOpenChange = output<boolean>();

  /** The main region is inert only while the mobile drawer overlays it. */
  readonly mainInert = computed(
    () => this.mobileNavOpen() && this.isMobileViewport(),
  );

  constructor() {
    afterRenderEffect(() => {
      const open = this.mobileNavOpen();
      const mobile = this.isMobileViewport();

      if (open && mobile && !this.lastMobileNavOpen) {
        if (!this.previousFocus) {
          this.previousFocus = document.activeElement as HTMLElement | null;
        }
        this.focusFirstInSidebar();
      }

      if ((!open || !mobile) && this.lastMobileNavOpen) {
        const restoreTarget =
          this.previousFocus ?? this.menuToggleRef()?.nativeElement ?? null;
        restoreTarget?.focus();
        this.previousFocus = null;
      }

      this.lastMobileNavOpen = open && mobile;
    });
  }

  ngOnInit(): void {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    this.mobileMediaQuery = window.matchMedia(SHELL_MOBILE_MEDIA);
    this.isMobileViewport.set(this.mobileMediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      this.isMobileViewport.set(event.matches);
      if (!event.matches && this.mobileNavOpen()) {
        this.mobileNavOpenChange.emit(false);
      }
    };

    this.mobileMediaQuery.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => {
      this.mobileMediaQuery?.removeEventListener('change', onChange);
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsedChange.emit(!this.sidebarCollapsed());
  }

  toggleMobileNav(): void {
    this.mobileNavOpenChange.emit(!this.mobileNavOpen());
  }

  closeMobileNav(): void {
    if (this.mobileNavOpen()) {
      this.mobileNavOpenChange.emit(false);
    }
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.mobileNavOpen() || !this.isMobileViewport()) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMobileNav();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private focusFirstInSidebar(): void {
    const focusables = this.getSidebarFocusables();
    focusables[0]?.focus();
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusables = this.getSidebarFocusables();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getSidebarFocusables(): HTMLElement[] {
    const sidebar = this.sidebarRef()?.nativeElement;
    if (!sidebar) {
      return [];
    }

    // Reuse the shared focusable-element helper, then drop the collapse
    // toggle: it is display: none at mobile widths, and this list only drives
    // mobile drawer focus management, so focus must land on a visible control.
    return getFocusableElements(sidebar).filter(
      (element) =>
        !element.classList.contains('jp-app-shell__collapse-toggle'),
    );
  }
}
