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

  it('maps font size by heading level', () => {
    fixture.componentRef.setInput('as', 'h1');
    fixture.detectChanges();
    expect(component.rootFontSize()).toBe('var(--jp-font-size-heading-h1)');

    fixture.componentRef.setInput('as', 'h2');
    fixture.detectChanges();
    expect(component.rootFontSize()).toBe('var(--jp-font-size-heading-h2)');

    fixture.componentRef.setInput('as', 'h4');
    fixture.detectChanges();
    expect(component.rootFontSize()).toBe('var(--jp-font-size-heading-h4)');

    fixture.componentRef.setInput('as', 'h6');
    fixture.detectChanges();
    expect(component.rootFontSize()).toBe('var(--jp-font-size-heading-h6)');
  });

  it('changes visual size without changing the document heading level', () => {
    fixture.componentRef.setInput('as', 'h2');
    fixture.componentRef.setInput('size', 'h4');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h4')).toBeNull();
    expect(component.rootFontSize()).toBe('var(--jp-font-size-heading-h4)');
    fixture.componentRef.setInput('size', null);
    fixture.detectChanges();
    expect(component.rootFontSize()).toBe('var(--jp-font-size-heading-h2)');
  });

  it('falls back to default for invalid tone', () => {
    fixture.componentRef.setInput('tone', 'bad' as never);
    fixture.detectChanges();

    expect(component.tone()).toBe('primary');
  });
});
