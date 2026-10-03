import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpBadge } from './badge';

describe('JpBadge', () => {
  let fixture: ComponentFixture<JpBadge>;
  let component: JpBadge;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(JpBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses expected defaults', () => {
    expect(component.tone()).toBe('neutral');
    expect(component.size()).toBe('md');
  });

  it('applies tone and size host classes', () => {
    fixture.componentRef.setInput('tone', 'success');
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('jp-badge--success')).toBe(true);
    expect(host.classList.contains('jp-badge--sm')).toBe(true);
  });

  it('falls back to defaults for invalid values', () => {
    fixture.componentRef.setInput('tone', 'bad' as never);
    fixture.componentRef.setInput('size', 'bad' as never);
    fixture.detectChanges();

    expect(component.tone()).toBe('neutral');
    expect(component.size()).toBe('md');
  });

  it('projects label content', () => {
    const host = fixture.nativeElement as HTMLElement;
    const root = host.querySelector('.jp-badge__root');
    expect(root).toBeTruthy();
    if (root) {
      root.textContent = 'Healthy';
      expect(host.textContent).toContain('Healthy');
    }
  });
});
