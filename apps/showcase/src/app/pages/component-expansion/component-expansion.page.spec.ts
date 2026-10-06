import { TestBed } from '@angular/core/testing';
import { ComponentExpansionPage } from './component-expansion.page';
describe('ComponentExpansionPage', () => {
  it('keeps invalid values, summarizes submission errors, and succeeds after correction', async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentExpansionPage],
    }).compileComponents();
    const f = TestBed.createComponent(ComponentExpansionPage);
    f.detectChanges();
    f.componentInstance.submit();
    f.detectChanges();
    await f.whenStable();
    expect(document.activeElement).toBe(
      f.nativeElement.querySelector('jp-error-summary section'),
    );
    expect(f.componentInstance.saved()).toBe(false);
    expect(f.componentInstance.errors()).toHaveLength(2);
    expect(f.componentInstance.emailError()).toBe(
      'Enter a valid email address.',
    );
    f.componentInstance.form.controls.email.setValue('ada@example.com');
    f.componentInstance.form.controls.password.setValue('example-password');
    f.componentInstance.submit();
    f.detectChanges();
    expect(f.componentInstance.saved()).toBe(true);
    expect(f.componentInstance.errors()).toHaveLength(0);
    expect(f.componentInstance.form.controls.password.value).toBe(
      'example-password',
    );
  });
});
