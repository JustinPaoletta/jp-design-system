import { CommonModule } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';

const SHELL_MOBILE_MEDIA = '(max-width: 48rem)';
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

@Component({
  selector: 'jp-app-shell',
  imports: [CommonModule],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-app-shell',
    '[class.jp-app-shell--collapsed]': 'sidebarCollapsed()',
    '[class.jp-app-shell--mobile-nav-open]': 'mobileNavOpen()',
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

  mainInert(): boolean {
    return this.mobileNavOpen() && this.isMobileViewport();
  }

  @HostListener('document:keydown', ['$event'])
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

    return Array.from(
      sidebar.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => !element.hasAttribute('disabled'));
  }
}
