import { DestroyRef, inject, signal, type Signal } from '@angular/core';

function readAccent(): string {
  return document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
}

function readDensity(): string {
  return document.documentElement.getAttribute('data-jp-density') ?? 'default';
}

/**
 * Live accent/density readouts for showcase pages.
 * Tracks `data-jp-accent` / `data-jp-density` on <html> so toolbars stay in sync
 * without remounting the page.
 */
export function injectDocumentTheme(): {
  accent: Signal<string>;
  density: Signal<string>;
} {
  const accent = signal(readAccent());
  const density = signal(readDensity());
  const destroyRef = inject(DestroyRef);

  const observer = new MutationObserver(() => {
    accent.set(readAccent());
    density.set(readDensity());
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-jp-accent', 'data-jp-density'],
  });

  destroyRef.onDestroy(() => observer.disconnect());

  return {
    accent: accent.asReadonly(),
    density: density.asReadonly(),
  };
}
