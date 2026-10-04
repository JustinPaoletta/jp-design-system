import {
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { Chart, ChartConfiguration } from 'chart.js';
import { JP_MESSAGES } from '../../i18n';
import { JpButton } from '../button/button';
export interface JpChartSeries {
  id: string;
  label: string;
  values: readonly (number | null)[];
}
/** Optional Chart.js bar/line integration, with equivalent native data controls. */
@Component({
  selector: 'jp-chart',
  imports: [JpButton],
  templateUrl: './chart.html',
  styleUrl: './chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpChart {
  readonly messages = inject(JP_MESSAGES).chart;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly description = input('');
  readonly type = input<'bar' | 'line'>('bar');
  readonly labels = input<readonly string[]>([]);
  readonly series = input<readonly JpChartSeries[]>([]);
  readonly locale = input('en-US');
  readonly formatOptions = input<Intl.NumberFormatOptions>({
    maximumFractionDigits: 2,
  });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input('');
  readonly retry = output<void>();
  readonly hiddenSeries = model<readonly string[]>([]);
  readonly activeIndex = model(0);
  readonly engineError = signal(false);
  readonly rendered = signal(false);
  readonly forcedColors = signal(false);
  private readonly themeRevision = signal(0);
  private generation = 0;
  private chart: Chart<'bar' | 'line'> | null = null;
  readonly invalid = computed(() => {
    const labels = this.labels(),
      series = this.series();
    return (
      !this.id().trim() ||
      !this.label().trim() ||
      !['bar', 'line'].includes(this.type()) ||
      labels.length > 500 ||
      series.length > 4 ||
      new Set(series.map((s) => s.id)).size !== series.length ||
      series.some(
        (s) =>
          !s.id.trim() ||
          !s.label.trim() ||
          s.values.length !== labels.length ||
          s.values.some((v) => v !== null && !Number.isFinite(v)),
      )
    );
  });
  readonly formatter = computed(() => {
    try {
      return new Intl.NumberFormat(this.locale(), this.formatOptions());
    } catch {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
    }
  });
  readonly visible = computed(() =>
    this.series().filter((s) => !this.hiddenSeries().includes(s.id)),
  );
  readonly index = computed(() =>
    Math.max(
      0,
      Math.min(
        this.labels().length - 1,
        Number.isFinite(this.activeIndex())
          ? Math.floor(this.activeIndex())
          : 0,
      ),
    ),
  );
  constructor() {
    afterNextRender(() => {
      const win = this.host.nativeElement.ownerDocument.defaultView;
      if (!win) return;
      const observer = new win.MutationObserver(() =>
        this.themeRevision.update((n) => n + 1),
      );
      for (
        let element: HTMLElement | null = this.host.nativeElement;
        element;
        element = element.parentElement
      )
        observer.observe(element, {
          attributes: true,
          attributeFilter: [
            'data-jp-accent',
            'data-jp-density',
            'dir',
            'class',
            'style',
          ],
        });
      const forced = win.matchMedia?.('(forced-colors: active)');
      const update = () => {
        this.forcedColors.set(forced?.matches ?? false);
        this.themeRevision.update((n) => n + 1);
      };
      update();
      forced?.addEventListener('change', update);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        forced?.removeEventListener('change', update);
        this.chart?.destroy();
        this.generation++;
      });
    });
    afterRenderEffect(() => {
      this.themeRevision();
      const canvas = this.canvas()?.nativeElement;
      const labels = [...this.labels()],
        series = this.visible(),
        type = this.type(),
        formatter = this.formatter();
      const inactive =
        this.loading() ||
        !!this.error() ||
        this.invalid() ||
        !labels.length ||
        !series.length;
      const generation = ++this.generation;
      this.chart?.destroy();
      this.chart = null;
      this.rendered.set(false);
      if (canvas && !inactive) {
        this.engineError.set(false);
        void import('chart.js')
          .then((engine) => {
            if (generation !== this.generation || this.destroyRef.destroyed)
              return;
            engine.Chart.register(
              engine.BarController,
              engine.LineController,
              engine.BarElement,
              engine.LineElement,
              engine.PointElement,
              engine.CategoryScale,
              engine.LinearScale,
              engine.Tooltip,
            );
            const style =
              this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(
                this.host.nativeElement,
              );
            const color = (name: string) =>
              style?.getPropertyValue('--jp-color-chart-' + name).trim() ||
              'currentColor';
            const allSeries = this.series();
            const config: ChartConfiguration<'bar' | 'line'> = {
              type,
              data: {
                labels,
                datasets: series.map((s) => {
                  const i = allSeries.findIndex((v) => v.id === s.id);
                  return {
                    label: s.label,
                    data: [...s.values],
                    backgroundColor: color('series-' + (i + 1)),
                    borderColor: color('series-' + (i + 1)),
                    borderWidth: 2,
                    borderDash: i ? [i * 3, 3] : [],
                    pointStyle: (
                      ['circle', 'rect', 'triangle', 'rectRot'] as const
                    )[i],
                    pointRadius: 4,
                    tension: 0,
                  };
                }),
              },
              options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                locale: formatter.resolvedOptions().locale,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        (context.dataset.label ?? '') +
                        ': ' +
                        formatter.format(context.parsed.y ?? 0),
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: color('axis') },
                    grid: { color: color('grid') },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: color('axis'),
                      callback: (value) => formatter.format(Number(value)),
                    },
                    grid: { color: color('grid') },
                  },
                },
              },
            };
            this.chart = new engine.Chart(canvas, config);
            this.rendered.set(true);
          })
          .catch(() => {
            if (generation === this.generation && !this.destroyRef.destroyed)
              this.engineError.set(true);
          });
      }
    });
  }
  format(value: number | null | undefined): string {
    return value === null || value === undefined
      ? this.messages.missing
      : this.formatter().format(value);
  }
  toggle(id: string): void {
    const keys = new Set(this.hiddenSeries());
    if (keys.has(id)) keys.delete(id);
    else keys.add(id);
    this.hiddenSeries.set([...keys]);
  }
  inspect(event: Event): void {
    this.activeIndex.set(Number((event.target as HTMLSelectElement).value));
  }
}
