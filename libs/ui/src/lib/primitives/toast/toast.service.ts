import { Injectable, signal } from '@angular/core';
import {
  type JpToastItem,
  type JpToastOptions,
  type JpToastTone,
} from '../shared/primitive-types';

const DEFAULT_DURATION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class JpToastService {
  private nextId = 1;
  private readonly itemsSignal = signal<JpToastItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();

  show(options: JpToastOptions): number {
    const id = this.nextId++;
    const tone: JpToastTone = options.tone ?? 'neutral';
    const durationMs = options.durationMs ?? DEFAULT_DURATION_MS;
    const item: JpToastItem = {
      id,
      message: options.message,
      tone,
      durationMs,
    };

    this.itemsSignal.update((current) => [...current, item]);

    if (durationMs > 0 && typeof window !== 'undefined') {
      window.setTimeout(() => this.dismiss(id), durationMs);
    }

    return id;
  }

  dismiss(id: number): void {
    this.itemsSignal.update((current) =>
      current.filter((item) => item.id !== id),
    );
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}
