import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpText } from './text';

describe('JpText', () => {
  let fixture: ComponentFixture<JpText>;
  let component: JpText;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpText],
    }).compileComponents();

    fixture = TestBed.createComponent(JpText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses defaults', () => {
    expect(component.as()).toBe('p');
    expect(component.hostDisplay()).toBe('block');
    expect(component.rootFontSize()).toBe('var(--jp-font-size-body)');
    expect(component.rootColor()).toBe('var(--jp-color-text-primary)');
  });

  it('keeps inline tags inline at the host level', () => {
    fixture.componentRef.setInput('as', 'span');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('span.jp-text__root');
    expect(root).toBeTruthy();
    expect(component.hostDisplay()).toBe('inline');
    expect(fixture.nativeElement.style.display).toBe('inline');
  });

  it('applies truncate mode styles', () => {
    fixture.componentRef.setInput('truncate', true);
    fixture.detectChanges();

    expect(component.rootWhiteSpace()).toBe('nowrap');
    expect(component.rootTextOverflow()).toBe('ellipsis');
  });

  it('falls back to defaults for invalid values', () => {
    fixture.componentRef.setInput('size', 'bad' as never);
    fixture.componentRef.setInput('tone', 'bad' as never);
    fixture.detectChanges();

    expect(component.size()).toBe('body');
    expect(component.tone()).toBe('primary');
  });
});
