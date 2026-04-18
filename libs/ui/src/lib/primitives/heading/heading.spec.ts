import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpHeading } from './heading';

describe('JpHeading', () => {
  let fixture: ComponentFixture<JpHeading>;
  let component: JpHeading;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpHeading],
    }).compileComponents();

    fixture = TestBed.createComponent(JpHeading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('maps auto size by heading level', () => {
    expect(component.rootFontSize()).toBe('var(--jp-font-size-display)');

    fixture.componentRef.setInput('as', 'h4');
    fixture.detectChanges();

    expect(component.rootFontSize()).toBe('var(--jp-font-size-title)');
  });

  it('supports explicit size override', () => {
    fixture.componentRef.setInput('size', 'title');
    fixture.componentRef.setInput('as', 'h1');
    fixture.detectChanges();

    expect(component.rootFontSize()).toBe('var(--jp-font-size-title)');
  });

  it('falls back to default for invalid size', () => {
    fixture.componentRef.setInput('size', 'bad' as never);
    fixture.detectChanges();

    expect(component.size()).toBe('auto');
  });
});
