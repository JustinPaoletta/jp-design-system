import { TestBed } from '@angular/core/testing';
import { JpTimeline } from './timeline';
describe('JpTimeline', () => {
  it('preserves event order and consumer-formatted dates without inventing a time zone', async () => {
    await TestBed.configureTestingModule({
      imports: [JpTimeline],
    }).compileComponents();
    const f = TestBed.createComponent(JpTimeline);
    f.componentRef.setInput('label', 'Activity');
    f.componentRef.setInput('events', [
      {
        id: 'one',
        title: 'Created',
        timeLabel: '4 Oct, 10:00 UTC',
        dateTime: '2026-10-04T10:00:00Z',
        description: 'Project created',
      },
      { id: 'two', title: 'Reviewed', timeLabel: 'Just now' },
    ]);
    f.detectChanges();
    expect(f.nativeElement.querySelectorAll('li')[0].textContent).toContain(
      'Created',
    );
    expect(
      f.nativeElement.querySelectorAll('time')[0].getAttribute('datetime'),
    ).toBe('2026-10-04T10:00:00Z');
    expect(f.nativeElement.querySelectorAll('time')).toHaveLength(1);
    expect(f.nativeElement.querySelector('.timestamp').textContent).toBe(
      'Just now',
    );
    f.componentRef.setInput('events', []);
    f.componentRef.setInput('emptyText', 'Noch keine Aktivität');
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Noch keine Aktivität');
  });
});
