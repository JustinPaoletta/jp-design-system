import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpTextarea } from './textarea';

describe('JpTextarea', () => {
  let fixture: ComponentFixture<JpTextarea>;
  let component: JpTextarea;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(JpTextarea);
    fixture.componentRef.setInput('label', 'Notes');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates with defaults', () => {
    expect(component.rows()).toBe(4);
    expect(component.size()).toBe('md');
    expect(component.invalid()).toBe(false);
  });

  it('applies rows and invalid state', () => {
    fixture.componentRef.setInput('rows', 6);
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('error', 'Too short');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(textarea.rows).toBe(6);
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('updates value from user input', () => {
    const textarea = fixture.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    textarea.value = 'Hello notes';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('Hello notes');
  });

  it('implements ControlValueAccessor and describedby', () => {
    const onChange = jest.fn();
    const onTouched = jest.fn();

    component.writeValue(null);
    expect(component.value()).toBe('');
    component.writeValue('draft');
    expect(component.value()).toBe('draft');

    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
    component.setDisabledState(false);

    fixture.componentRef.setInput('hint', 'Optional');
    fixture.detectChanges();
    expect(component.describedBy()).toContain('-hint');

    const textarea = fixture.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    textarea.value = 'updated';
    textarea.dispatchEvent(new Event('input'));
    textarea.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(onChange).toHaveBeenCalledWith('updated');
    expect(onTouched).toHaveBeenCalled();
  });
});
