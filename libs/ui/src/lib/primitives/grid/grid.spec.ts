import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpGrid } from './grid';

describe('JpGrid', () => {
  let fixture: ComponentFixture<JpGrid>;
  let component: JpGrid;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(JpGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses fixed mode by default', () => {
    expect(component.mode()).toBe('fixed');
    expect(component.rootTemplateColumns()).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('supports auto-fit mode with semantic min column vars', () => {
    fixture.componentRef.setInput('mode', 'auto-fit');
    fixture.componentRef.setInput('minColumn', 'lg');
    fixture.detectChanges();

    expect(component.rootTemplateColumns()).toBe(
      'repeat(auto-fit, minmax(var(--jp-size-column-min-lg), 1fr))',
    );
  });

  it('falls back for invalid numeric and string unions', () => {
    fixture.componentRef.setInput('columns', '9' as never);
    fixture.componentRef.setInput('mode', 'bad' as never);
    fixture.detectChanges();

    expect(component.columns()).toBe(3);
    expect(component.mode()).toBe('fixed');
  });
});
