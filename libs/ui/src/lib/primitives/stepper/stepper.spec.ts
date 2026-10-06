import { TestBed } from '@angular/core/testing';
import { JpStepper } from './stepper';
describe('JpStepper', () => {
  async function mount(navigable = false) {
    await TestBed.configureTestingModule({
      imports: [JpStepper],
    }).compileComponents();
    const f = TestBed.createComponent(JpStepper);
    f.componentRef.setInput('label', 'Setup');
    f.componentRef.setInput('currentId', 'details');
    f.componentRef.setInput('navigable', navigable);
    f.componentRef.setInput('steps', [
      { id: 'intro', label: 'Intro', state: 'complete' },
      {
        id: 'details',
        label: 'Details',
        state: 'error',
        description: 'Check your email',
      },
      { id: 'review', label: 'Review', disabled: true },
    ]);
    f.detectChanges();
    return f;
  }
  it('exposes current step and textual completed/error states without requiring color', async () => {
    const f = await mount();
    expect(f.nativeElement.querySelectorAll('li')).toHaveLength(3);
    expect(
      f.nativeElement.querySelector('[aria-current=step]').textContent,
    ).toContain('Details');
    expect(f.nativeElement.textContent).toContain('Completed');
    expect(f.nativeElement.textContent).toContain('Needs attention');
    expect(f.nativeElement.querySelector('button')).toBeNull();
    const select = jest.fn();
    f.componentInstance.stepSelected.subscribe(select);
    f.componentInstance.select({ id: 'intro', label: 'Intro' });
    expect(select).not.toHaveBeenCalled();
  });
  it('emits requests for enabled steps while leaving navigation policy to its consumer', async () => {
    const f = await mount(true);
    const selected = jest.fn();
    f.componentInstance.stepSelected.subscribe(selected);
    const buttons = f.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons[2].disabled).toBe(true);
    buttons[0].click();
    f.componentInstance.select({
      id: 'review',
      label: 'Review',
      disabled: true,
    });
    expect(selected).toHaveBeenCalledTimes(1);
    expect(selected).toHaveBeenCalledWith('intro');
    expect(f.componentInstance.currentId()).toBe('details');
    f.componentRef.setInput('currentId', 'intro');
    f.detectChanges();
    expect(buttons[0].getAttribute('aria-current')).toBe('step');
  });
});
