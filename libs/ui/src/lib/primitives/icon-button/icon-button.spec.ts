import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpIconButton } from './icon-button';

describe('JpIconButton', () => {
  let fixture: ComponentFixture<JpIconButton>;
  let component: JpIconButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpIconButton],
    }).compileComponents();

    fixture = TestBed.createComponent(JpIconButton);
    fixture.componentRef.setInput('ariaLabel', 'Collapse sidebar');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses expected defaults', () => {
    expect(component.size()).toBe('md');
    expect(component.type()).toBe('button');
    expect(component.disabled()).toBe(false);
    expect(component.rootSize()).toBe('var(--jp-size-control-md)');
  });

  it('sets aria-label on the native button', () => {
    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Collapse sidebar');
  });

  it('disables the native button', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
