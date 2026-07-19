import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpSelect } from './select';

describe('JpSelect', () => {
  let fixture: ComponentFixture<JpSelect>;
  let component: JpSelect;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(JpSelect);
    fixture.componentRef.setInput('label', 'Role');
    fixture.componentRef.setInput('options', [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
    ]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates with defaults', () => {
    expect(component.size()).toBe('md');
    expect(component.invalid()).toBe(false);
    expect(component.options().length).toBe(2);
  });

  it('renders options and updates value on change', () => {
    const select = fixture.nativeElement.querySelector(
      'select',
    ) as HTMLSelectElement;
    expect(select.options.length).toBe(2);

    select.value = 'editor';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.value()).toBe('editor');
  });

  it('marks invalid state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('error', 'Pick a role');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select',
    ) as HTMLSelectElement;
    expect(select.getAttribute('aria-invalid')).toBe('true');
  });

  it('implements ControlValueAccessor and describedby', () => {
    const onChange = jest.fn();
    const onTouched = jest.fn();

    component.writeValue(null);
    expect(component.value()).toBe('');
    component.writeValue('admin');
    expect(component.value()).toBe('admin');

    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
    component.setDisabledState(false);

    fixture.componentRef.setInput('hint', 'Choose carefully');
    fixture.detectChanges();
    expect(component.describedBy()).toContain('-hint');

    const select = fixture.nativeElement.querySelector(
      'select',
    ) as HTMLSelectElement;
    select.value = 'editor';
    select.dispatchEvent(new Event('change'));
    select.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(onChange).toHaveBeenCalledWith('editor');
    expect(onTouched).toHaveBeenCalled();
  });
});
