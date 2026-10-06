import { TestBed } from '@angular/core/testing';
import { JpErrorSummary } from './error-summary';

describe('JpErrorSummary', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpErrorSummary],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpErrorSummary);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('is absent without errors and explicitly focuses the summary or a linked native control', async () => {
    const f = await mount({ errors: [], id: 'summary' });
    f.componentInstance.focus();
    expect(f.nativeElement.querySelector('section')).toBeNull();
    const input = document.createElement('input');
    input.id = 'invalid-email';
    document.body.append(input);
    try {
      f.componentRef.setInput('errors', [
        { controlId: input.id, message: 'Enter an email' },
      ]);
      f.detectChanges();
      f.componentInstance.focus();
      expect(document.activeElement).toBe(
        f.nativeElement.querySelector('section'),
      );
      (f.nativeElement.querySelector('a') as HTMLAnchorElement).click();
      expect(document.activeElement).toBe(input);
    } finally {
      input.remove();
    }
  });
  it('can target the inner control of a component and leaves missing targets to native navigation', async () => {
    const f = await mount({
      errors: [{ controlId: 'missing', message: 'Fix it' }],
    });
    const event = new Event('click', { cancelable: true });
    f.componentInstance.focusControl(event, 'missing');
    expect(event.defaultPrevented).toBe(false);
    const wrapper = document.createElement('div');
    wrapper.id = 'custom';
    const button = document.createElement('button');
    wrapper.append(button);
    document.body.append(wrapper);
    try {
      f.componentInstance.focusControl(
        new Event('click', { cancelable: true }),
        'custom',
      );
      expect(document.activeElement).toBe(button);
    } finally {
      wrapper.remove();
    }
  });
});
