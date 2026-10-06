import { TestBed } from '@angular/core/testing';
import { JpChart } from './chart';
import { provideJpMessages } from '../../i18n';
const mockCreate = jest.fn();
const mockDestroy = jest.fn();
jest.mock('chart.js', () => ({
  Chart: class {
    static register = jest.fn();
    constructor(canvas: unknown, config: unknown) {
      mockCreate(canvas, config);
    }
    destroy = mockDestroy;
  },
  BarController: {},
  LineController: {},
  BarElement: {},
  LineElement: {},
  PointElement: {},
  CategoryScale: {},
  LinearScale: {},
  Tooltip: {},
}));
const series = [
  { id: 'one', label: 'One', values: [10, null] },
  { id: 'two', label: 'Two', values: [20, 30] },
];
async function setup() {
  const f = TestBed.createComponent(JpChart);
  f.componentRef.setInput('id', 'chart-test');
  f.componentRef.setInput('label', 'Work');
  f.componentRef.setInput('labels', ['April', 'May']);
  f.componentRef.setInput('series', series);
  f.detectChanges();
  await new Promise((resolve) => setTimeout(resolve, 0));
  f.detectChanges();
  await f.whenStable();
  return f;
}
describe('JpChart', () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockDestroy.mockClear();
  });
  it('renders actual engine configuration without motion and exposes equivalent data', async () => {
    const f = await setup();
    const config = mockCreate.mock.calls.at(-1)?.[1];
    expect(config.options.animation).toBe(false);
    expect(config.data.datasets).toHaveLength(2);
    expect(
      f.nativeElement.querySelector('canvas').getAttribute('aria-label'),
    ).toBe('Work');
    expect(f.nativeElement.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(f.nativeElement.textContent).toContain('No value');
    f.destroy();
    expect(mockDestroy).toHaveBeenCalled();
  });
  it('renders controlled legend visibility and can restore all series', async () => {
    const f = await setup();
    f.componentInstance.toggle('one');
    f.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    f.detectChanges();
    await f.whenStable();
    expect(f.componentInstance.visible().map((s) => s.id)).toEqual(['two']);
    f.componentInstance.toggle('two');
    f.detectChanges();
    expect(f.nativeElement.querySelector('canvas')).toBeNull();
    f.componentInstance.toggle('one');
    f.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    f.detectChanges();
    await f.whenStable();
    expect(f.componentInstance.visible().map((s) => s.id)).toEqual(['one']);
  });
  it('inspects category with keyboard-friendly native control and formats values', async () => {
    const f = await setup();
    const select = f.nativeElement.querySelector('select');
    select.value = '1';
    select.dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(f.componentInstance.index()).toBe(1);
    expect(f.nativeElement.querySelector('dl').textContent).toContain('30');
    expect(f.componentInstance.format(null)).toBe('No value');
    expect(f.componentInstance.format(undefined)).toBe('No value');
  });
  it('clamps invalid selected indices and falls back from invalid number format options', async () => {
    const f = await setup();
    f.componentInstance.activeIndex.set(Infinity);
    f.componentRef.setInput('locale', 'bad_locale');
    f.detectChanges();
    expect(f.componentInstance.index()).toBe(0);
    expect(f.componentInstance.format(1200)).toBe('1,200');
    f.componentInstance.activeIndex.set(99);
    expect(f.componentInstance.index()).toBe(1);
  });
  it('provides translated labels and state copy', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideJpMessages({
          chart: { missing: 'Sin valor', loading: 'Cargando' },
        }),
      ],
    });
    const f = await setup();
    expect(f.componentInstance.format(null)).toBe('Sin valor');
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Cargando');
    expect(f.nativeElement.querySelector('canvas')).toBeNull();
  });
  it('preserves data when the engine fails', async () => {
    const f = await setup();
    f.componentInstance.engineError.set(true);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Chart unavailable');
    expect(f.nativeElement.querySelectorAll('tbody tr')).toHaveLength(2);
  });
  it('renders error/retry and empty states', async () => {
    const f = await setup();
    const retry = jest.fn();
    f.componentInstance.retry.subscribe(retry);
    f.componentRef.setInput('error', 'Offline');
    f.detectChanges();
    f.nativeElement.querySelector('jp-button button').click();
    expect(retry).toHaveBeenCalled();
    f.componentRef.setInput('error', '');
    f.componentRef.setInput('labels', []);
    f.componentRef.setInput('series', []);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('No chart data');
  });
  it.each(
    [
      [{ id: 'one', label: 'One', values: [1] }],
      [
        { id: 'one', label: 'One', values: [1, 2] },
        { id: 'one', label: 'Duplicate', values: [2, 3] },
      ],
      [{ id: 'one', label: 'One', values: [NaN, 2] }],
      [{ id: '', label: 'One', values: [1, 2] }],
      [{ id: 'one', label: '', values: [1, 2] }],
      Array.from({ length: 5 }, (_, i) => ({
        id: String(i),
        label: String(i),
        values: [1, 2],
      })),
    ].map((value) => [value]),
  )(
    'rejects unsafe series instead of silently misrepresenting data',
    async (value) => {
      const f = await setup();
      f.componentRef.setInput('series', value);
      f.detectChanges();
      expect(f.componentInstance.invalid()).toBe(true);
      expect(f.nativeElement.querySelector('canvas')).toBeNull();
    },
  );
  it('rejects oversized labels and invalid identity/type', async () => {
    const f = await setup();
    f.componentRef.setInput('labels', Array(501).fill('x'));
    f.detectChanges();
    expect(f.componentInstance.invalid()).toBe(true);
    f.componentRef.setInput('labels', ['April', 'May']);
    f.componentRef.setInput('id', ' ');
    f.detectChanges();
    expect(f.componentInstance.invalid()).toBe(true);
    f.componentRef.setInput('id', 'chart');
    f.componentRef.setInput('type', 'pie');
    f.detectChanges();
    expect(f.componentInstance.invalid()).toBe(true);
  });
  it('retains native data when chart construction fails', async () => {
    mockCreate.mockImplementationOnce(() => {
      throw new Error('No canvas context');
    });
    const f = await setup();
    expect(f.componentInstance.engineError()).toBe(true);
    expect(f.nativeElement.querySelectorAll('tbody tr')).toHaveLength(2);
  });
  it('does not construct an engine after teardown', async () => {
    const f = TestBed.createComponent(JpChart);
    f.componentRef.setInput('id', 'dispose-chart');
    f.componentRef.setInput('label', 'Dispose');
    f.componentRef.setInput('labels', ['April', 'May']);
    f.componentRef.setInput('series', series);
    f.detectChanges();
    f.destroy();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockCreate).not.toHaveBeenCalled();
  });
  it('recreates on explicit chart type and theme changes', async () => {
    const f = await setup();
    f.componentRef.setInput('type', 'line');
    f.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    f.detectChanges();
    await f.whenStable();
    expect(mockCreate.mock.calls.at(-1)?.[1].type).toBe('line');
    document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    await new Promise((resolve) => setTimeout(resolve, 0));
    f.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    f.detectChanges();
    await f.whenStable();
    expect(mockCreate.mock.calls.length).toBeGreaterThan(1);
    document.documentElement.removeAttribute('data-jp-accent');
  });
});
