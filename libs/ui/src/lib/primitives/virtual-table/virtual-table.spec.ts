import { TestBed } from '@angular/core/testing';
import { JpVirtualTable, jpVirtualRange } from './virtual-table';
import { provideJpMessages } from '../../i18n';
const rows = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: 'Service ' + i,
  value: i,
}));
const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'value', header: 'Value' },
];
function setup() {
  const f = TestBed.createComponent(JpVirtualTable);
  f.componentRef.setInput('label', 'Inventory');
  f.componentRef.setInput('rows', rows);
  f.componentRef.setInput('columns', columns);
  f.detectChanges();
  return f;
}
describe('JpVirtualTable', () => {
  it('preserves scroll and page when the already-active mode is chosen', () => {
    const f = setup();
    const frame = f.nativeElement.querySelector('.frame');
    frame.scrollTop = 48000;
    frame.dispatchEvent(new Event('scroll'));
    f.detectChanges();
    const range = f.componentInstance.range();
    f.componentInstance.chooseMode(true);
    f.detectChanges();
    expect(f.componentInstance.range()).toEqual(range);
    expect(frame.scrollTop).toBe(48000);
    f.componentInstance.chooseMode(false);
    f.componentInstance.page.set(200);
    f.detectChanges();
    f.componentInstance.chooseMode(false);
    f.detectChanges();
    expect(f.componentInstance.currentPage()).toBe(200);
  });
  it('includes partial boundary rows with zero overscan', () => {
    const f = setup();
    f.componentRef.setInput('overscan', 0);
    f.detectChanges();
    const frame = f.nativeElement.querySelector('.frame');
    for (const [offset, start, end] of [
      [24, 0, 8],
      [48, 1, 8],
      [1000, 20, 28],
    ]) {
      frame.scrollTop = offset;
      frame.dispatchEvent(new Event('scroll'));
      f.detectChanges();
      expect(f.componentInstance.range()).toEqual({ start, end, total: 10000 });
      expect(
        f.nativeElement.querySelectorAll('tr[data-row-index]').length,
      ).toBe(end - start);
    }
  });
  it('uses whole-pixel row geometry for fractional inputs across distant windows', () => {
    const f = setup();
    for (const [requested, rounded] of [
      [48.1, 48],
      [48.5, 49],
    ]) {
      f.componentRef.setInput('rowHeight', requested);
      f.componentInstance.scrollTop.set(400000);
      f.detectChanges();
      const frame: HTMLElement = f.nativeElement.querySelector('.frame');
      const spacer = frame.querySelector<HTMLElement>('.spacer td');
      if (!spacer) throw new Error('Expected a spacer for the distant window');
      const range = f.componentInstance.range();
      expect(frame.style.getPropertyValue('--row-height')).toBe(rounded + 'px');
      expect(spacer.style.height).toBe(range.start * rounded + 'px');
      expect(range).toEqual(jpVirtualRange(10000, 400000, 360, requested, 6));
      expect(range).toEqual(jpVirtualRange(10000, 400000, 360, rounded, 6));
    }
  });
  it('recovers focus before sorting removes a keyed checkbox from the mounted window', () => {
    const f = setup();
    f.componentRef.setInput('selectable', true);
    f.detectChanges();
    const checkbox = f.nativeElement.querySelector('tbody input');
    const frame = f.nativeElement.querySelector('.frame');
    checkbox.focus();
    let connectedAtRecovery = false;
    frame.addEventListener('focus', () => {
      connectedAtRecovery = checkbox.isConnected;
    });
    f.componentRef.setInput('rows', [...rows].reverse());
    f.detectChanges();
    expect(document.activeElement).toBe(frame);
    expect(connectedAtRecovery).toBe(true);
    expect(checkbox.isConnected).toBe(false);
  });
  it('recovers focus before a dataset shrink clamps the scroll window', () => {
    const f = setup();
    f.componentRef.setInput('selectable', true);
    f.detectChanges();
    const frame = f.nativeElement.querySelector('.frame');
    frame.scrollTop = 48000;
    frame.dispatchEvent(new Event('scroll'));
    f.detectChanges();
    const checkbox = f.nativeElement.querySelector('tbody input');
    checkbox.focus();
    f.componentRef.setInput('rows', rows.slice(0, 3));
    f.detectChanges();
    expect(document.activeElement).toBe(frame);
    expect(frame.scrollTop).toBe(0);
    expect(f.componentInstance.scrollTop()).toBe(0);
  });
  it('recovers a focused checkbox when selection controls are removed but preserves outside focus', () => {
    const f = setup();
    f.componentRef.setInput('selectable', true);
    f.detectChanges();
    const frame = f.nativeElement.querySelector('.frame');
    f.nativeElement.querySelector('tbody input').focus();
    f.componentRef.setInput('selectable', false);
    f.detectChanges();
    expect(document.activeElement).toBe(frame);
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    f.componentRef.setInput('rows', [...rows].reverse());
    f.detectChanges();
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
  it('moves focus to an existing mode control if consumer state removes the viewport', () => {
    const f = setup();
    f.componentRef.setInput('selectable', true);
    f.detectChanges();
    f.nativeElement.querySelector('tbody input').focus();
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('.modes button[aria-pressed="true"]'),
    );
  });
  it('bounds DOM size and reports full native table row indices', () => {
    const f = setup();
    expect(
      f.nativeElement.querySelectorAll('tr[data-row-index]').length,
    ).toBeLessThan(30);
    expect(
      f.nativeElement.querySelector('table').getAttribute('aria-rowcount'),
    ).toBe('10001');
    expect(
      f.nativeElement
        .querySelector('tr[data-row-index]')
        .getAttribute('aria-rowindex'),
    ).toBe('2');
    expect(f.nativeElement.querySelector('.spacer')).not.toBeNull();
  });
  it('scrolls to middle and last rows without rendering the whole dataset', () => {
    const f = setup();
    const frame = f.nativeElement.querySelector('.frame');
    frame.scrollTop = 48000;
    frame.dispatchEvent(new Event('scroll'));
    f.detectChanges();
    expect(f.componentInstance.range().start).toBeGreaterThan(990);
    frame.scrollTop = 480000;
    frame.dispatchEvent(new Event('scroll'));
    f.detectChanges();
    expect(f.componentInstance.range().end).toBe(10000);
    expect(f.nativeElement.textContent).toContain('Service 9999');
  });
  it('recovers focus before recycling a focused row', () => {
    const f = setup();
    f.componentRef.setInput('selectable', true);
    f.detectChanges();
    const checkbox = f.nativeElement.querySelector('tbody input');
    checkbox.focus();
    const frame = f.nativeElement.querySelector('.frame');
    frame.scrollTop = 48000;
    frame.dispatchEvent(new Event('scroll'));
    expect(document.activeElement).toBe(frame);
  });
  it('retains selection across windows and explicit unselection', () => {
    const f = setup();
    const selected = jest.fn();
    f.componentInstance.selectionChange.subscribe(selected);
    f.componentRef.setInput('selectedKeys', [9999]);
    f.detectChanges();
    f.componentInstance.select(rows[0], true);
    expect(selected).toHaveBeenLastCalledWith([9999, 0]);
    f.componentInstance.select(rows[9999], false);
    expect(selected).toHaveBeenLastCalledWith([]);
  });
  it('provides a paginated native table alternative and clamps page', () => {
    const f = setup();
    f.componentInstance.chooseMode(false);
    f.componentInstance.page.set(999);
    f.detectChanges();
    expect(f.componentInstance.currentPage()).toBe(200);
    expect(f.nativeElement.querySelectorAll('jp-table tbody tr')).toHaveLength(
      50,
    );
    expect(f.nativeElement.textContent).toContain('Service 9999');
    f.componentInstance.chooseMode(true);
    f.detectChanges();
    expect(f.componentInstance.page()).toBe(1);
  });
  it('requests consumer-owned sort and cycles direction', () => {
    const f = setup();
    const sort = jest.fn();
    f.componentInstance.sortChange.subscribe(sort);
    f.componentInstance.requestSort(columns[0]);
    expect(sort).toHaveBeenLastCalledWith({ key: 'name', direction: 'asc' });
    f.componentRef.setInput('sort', { key: 'name', direction: 'asc' });
    f.detectChanges();
    expect(f.componentInstance.ariaSort(columns[0])).toBe('ascending');
    f.componentInstance.requestSort(columns[0]);
    expect(sort).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    f.componentRef.setInput('sort', { key: 'name', direction: 'desc' });
    f.detectChanges();
    expect(f.componentInstance.ariaSort(columns[0])).toBe('descending');
    f.componentInstance.requestSort(columns[0]);
    expect(sort).toHaveBeenLastCalledWith(null);
    expect(f.componentInstance.ariaSort(columns[1])).toBeNull();
    f.componentInstance.requestSort(columns[1]);
    expect(sort).toHaveBeenCalledTimes(3);
  });
  it('clamps scroll when consumer shrinks the dataset', () => {
    const f = setup();
    f.componentInstance.scrollTop.set(480000);
    f.detectChanges();
    f.componentRef.setInput('rows', rows.slice(0, 3));
    f.detectChanges();
    expect(f.componentInstance.scrollTop()).toBe(0);
    expect(f.componentInstance.visible()).toHaveLength(3);
  });
  it('handles empty/loading/error/retry and translated copy', () => {
    TestBed.configureTestingModule({
      providers: [provideJpMessages({ virtualTable: { empty: 'Sin filas' } })],
    });
    const f = setup();
    f.componentRef.setInput('loading', true);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Loading rows');
    f.componentRef.setInput('loading', false);
    f.componentRef.setInput('error', 'Offline');
    f.detectChanges();
    const retry = jest.fn();
    f.componentInstance.retry.subscribe(retry);
    f.nativeElement.querySelector('jp-button:last-child button')?.click();
    f.componentRef.setInput('error', '');
    f.componentRef.setInput('rows', []);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Sin filas');
    expect(f.componentInstance.rangeLabel()).toBe('0–0 of 0 rows');
  });
  it('validates stable identifiers and duplicate column keys', () => {
    const f = setup();
    f.componentRef.setInput('rows', [{ id: 1 }, { id: 1 }]);
    f.detectChanges();
    expect(f.componentInstance.invalid()).toBe(true);
    f.componentRef.setInput('rows', [{ name: 'Missing' }]);
    f.detectChanges();
    expect(f.componentInstance.invalid()).toBe(true);
    expect(f.componentInstance.keyFor({ id: NaN })).toBeNull();
    f.componentRef.setInput('rowKey', (row: Record<string, unknown>) =>
      String(row['name']),
    );
    f.componentRef.setInput('columns', [columns[0], columns[0]]);
    f.detectChanges();
    expect(f.componentInstance.invalid()).toBe(true);
  });
  it('normalizes invalid numeric options and text values', () => {
    const f = setup();
    f.componentRef.setInput('height', Infinity);
    f.componentRef.setInput('rowHeight', NaN);
    f.componentRef.setInput('pageSize', 0);
    f.componentInstance.page.set(NaN);
    f.detectChanges();
    expect(f.componentInstance.safeHeight()).toBe(360);
    expect(f.componentInstance.safeRowHeight()).toBe(48);
    expect(f.componentInstance.safePageSize()).toBe(1);
    expect(f.componentInstance.currentPage()).toBe(1);
    expect(f.componentInstance.text(null)).toBe('');
    expect(f.componentInstance.text(undefined)).toBe('');
  });
});
describe('jpVirtualRange', () => {
  it('rounds fractional row heights before calculating distant boundary windows', () => {
    for (const [requested, rounded] of [
      [48.1, 48],
      [48.5, 49],
      [159.9, 160],
    ]) {
      for (const offset of [24, 1000, 400000, 1000000])
        expect(jpVirtualRange(10000, offset, 360, requested, 0)).toEqual(
          jpVirtualRange(10000, offset, 360, rounded, 0),
        );
    }
  });
  it('keeps exported ranges bounded by the component geometry limits', () => {
    expect(jpVirtualRange(10000, 0, 5000, 48, 6)).toEqual({
      start: 0,
      end: 37,
      total: 10000,
    });
    const f = setup();
    f.componentRef.setInput('height', 5000);
    f.componentRef.setInput('rowHeight', 500);
    f.componentRef.setInput('overscan', 0);
    f.detectChanges();
    expect(jpVirtualRange(10000, 0, 5000, 500, 0)).toEqual(
      f.componentInstance.range(),
    );
    expect(f.componentInstance.visible()).toHaveLength(8);
  });
  it('handles empty, invalid metrics and far-out scroll offsets', () => {
    expect(jpVirtualRange(NaN, Infinity, NaN, NaN, NaN)).toEqual({
      start: 0,
      end: 0,
      total: 0,
    });
    expect(jpVirtualRange(10000, 480000, 360, 48, 6)).toEqual({
      start: 9987,
      end: 10000,
      total: 10000,
    });
    expect(jpVirtualRange(10, 0, 120, 40, -10)).toEqual({
      start: 0,
      end: 2,
      total: 10,
    });
  });
});
