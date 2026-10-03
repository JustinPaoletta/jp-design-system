import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpToast } from './toast';
import { JpToastOutlet } from './toast-outlet';
import { JpToastService } from './toast.service';

describe('JpToast', () => {
  let fixture: ComponentFixture<JpToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpToast],
    }).compileComponents();

    fixture = TestBed.createComponent(JpToast);
    fixture.componentRef.setInput('message', 'Saved');
    fixture.detectChanges();
  });

  it('renders message with status role', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('status');
    expect(host.textContent).toContain('Saved');
    expect(host.classList.contains('jp-toast--neutral')).toBe(true);
  });

  it('emits dismissed on dismiss click', () => {
    const spy = jest.fn();
    fixture.componentInstance.dismissed.subscribe(spy);
    const button = fixture.nativeElement.querySelector(
      '.jp-toast__dismiss',
    ) as HTMLButtonElement;
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('applies tone class', () => {
    fixture.componentRef.setInput('tone', 'success');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains(
        'jp-toast--success',
      ),
    ).toBe(true);
  });
});

describe('JpToastService + outlet', () => {
  @Component({
    standalone: true,
    imports: [JpToastOutlet],
    template: `<jp-toast-outlet />`,
  })
  class OutletHost {}

  let service: JpToastService;
  let fixture: ComponentFixture<OutletHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutletHost],
    }).compileComponents();

    service = TestBed.inject(JpToastService);
    service.clear();
    fixture = TestBed.createComponent(OutletHost);
    fixture.detectChanges();
  });

  it('shows and dismisses toasts via service', () => {
    jest.useFakeTimers();
    const id = service.show({
      message: 'Deployed',
      tone: 'success',
      durationMs: 1000,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Deployed');
    expect(service.items().some((item) => item.id === id)).toBe(true);

    jest.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(service.items().length).toBe(0);
    jest.useRealTimers();
  });

  it('dismisses via service and outlet click', () => {
    const id = service.show({ message: 'Hello', durationMs: 0 });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hello');

    const dismiss = fixture.nativeElement.querySelector(
      '.jp-toast__dismiss',
    ) as HTMLButtonElement;
    dismiss.click();
    fixture.detectChanges();
    expect(service.items().some((item) => item.id === id)).toBe(false);
  });

  it('clears all toasts', () => {
    service.show({ message: 'One', durationMs: 0 });
    service.show({ message: 'Two', durationMs: 0 });
    fixture.detectChanges();
    service.clear();
    fixture.detectChanges();
    expect(service.items().length).toBe(0);
  });
});
