import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpButton } from './button';

describe('JpButton', () => {
  let fixture: ComponentFixture<JpButton>;
  let component: JpButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpButton],
    }).compileComponents();

    fixture = TestBed.createComponent(JpButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses expected defaults', () => {
    expect(component.variant()).toBe('primary');
    expect(component.size()).toBe('md');
    expect(component.type()).toBe('button');
    expect(component.disabled()).toBe(false);
    expect(component.rootHeight()).toBe('var(--jp-size-control-md)');
  });

  it('applies variant and size host classes', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('jp-button--secondary')).toBe(true);
    expect(host.classList.contains('jp-button--lg')).toBe(true);
  });

  it('falls back to defaults for invalid values', () => {
    fixture.componentRef.setInput('variant', 'bad' as never);
    fixture.componentRef.setInput('size', 'bad' as never);
    fixture.componentRef.setInput('type', 'bad' as never);
    fixture.detectChanges();

    expect(component.variant()).toBe('primary');
    expect(component.size()).toBe('md');
    expect(component.type()).toBe('button');
  });

  it('disables the native button', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains(
        'jp-button--disabled',
      ),
    ).toBe(true);
  });

  it('sets native button type', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });
});
