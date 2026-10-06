import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideJpMessages } from '../../i18n';
import { JpCarousel, JpCarouselSlide } from './carousel';
@Component({
  imports: [JpCarousel, JpCarouselSlide],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<jp-carousel
    id="guide"
    label="Workspace guide"
    [autoRotate]="auto"
    [interval]="interval"
    [loop]="loop"
    [disabled]="disabled"
    [index]="index"
  >
    <ng-template jpCarouselSlide="one" label="First"
      ><h2>First card</h2>
      <input aria-label="Notes"
    /></ng-template>
    <ng-template jpCarouselSlide="two" label="Second"
      ><h2>Second card</h2>
      <button type="button">Open second</button></ng-template
    >
    <ng-template jpCarouselSlide="three"><h2>Third card</h2></ng-template>
  </jp-carousel>`,
})
class Host {
  auto = false;
  interval = 1000;
  loop = true;
  disabled = false;
  index = 0;
  carousel = viewChild.required(JpCarousel);
}
function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return fixture;
}
function key(component: JpCarousel, name: string, target?: HTMLElement) {
  const viewport = component.viewport()?.nativeElement;
  const event = {
    key: name,
    target: target ?? viewport,
    currentTarget: viewport,
    preventDefault: jest.fn(),
  } as unknown as KeyboardEvent;
  component.onKey(event);
  return event;
}
describe('JpCarousel', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  it('exposes named region/slide, grouped controls and hides/inerts all inactive content', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    expect(
      root.querySelector('section')?.getAttribute('aria-roledescription'),
    ).toBe('carousel');
    expect(root.querySelectorAll('.slide[hidden]')).toHaveLength(2);
    expect(root.querySelector('.slide[hidden]')?.hasAttribute('inert')).toBe(
      true,
    );
    expect(root.querySelector('.slide')?.getAttribute('aria-label')).toBe(
      'First',
    );
    expect(
      root.querySelector('.pickers button')?.getAttribute('aria-disabled'),
    ).toBe('true');
    expect(root.textContent).toContain('1 of 3');
    expect(fixture.componentInstance.carousel().rotating()).toBe(false);
    fixture.componentInstance.carousel().choose(1);
    fixture.detectChanges();
    expect(root.querySelector('.slide:not([hidden])')?.textContent).toContain(
      'Second card',
    );
    expect(
      root.querySelector('.slide:not([hidden])')?.hasAttribute('inert'),
    ).toBe(false);
  });
  it('supports viewport arrow/Home/End keys and RTL without intercepting input keys', () => {
    const fixture = setup();
    const component = fixture.componentInstance.carousel();
    key(component, 'ArrowRight');
    expect(component.current()).toBe(1);
    key(component, 'End');
    expect(component.current()).toBe(2);
    key(component, 'ArrowRight');
    expect(component.current()).toBe(0);
    key(component, 'ArrowLeft');
    expect(component.current()).toBe(2);
    key(component, 'Home');
    expect(component.current()).toBe(0);
    const input = fixture.nativeElement.querySelector('input');
    expect(
      key(component, 'ArrowRight', input).preventDefault,
    ).not.toHaveBeenCalled();
    expect(component.current()).toBe(0);
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ direction: 'rtl' } as CSSStyleDeclaration);
    key(component, 'ArrowLeft');
    expect(component.current()).toBe(1);
    key(component, 'ArrowRight');
    expect(component.current()).toBe(0);
    expect(key(component, 'Tab').preventDefault).not.toHaveBeenCalled();
  });
  it('clamps indices and supports bounded/disabled navigation', () => {
    const fixture = setup();
    const host = fixture.componentInstance;
    const component = host.carousel();
    component.index.set(Infinity);
    expect(component.current()).toBe(0);
    component.index.set(99);
    expect(component.current()).toBe(2);
    host.loop = false;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    component.step(1);
    expect(component.current()).toBe(2);
    component.choose(-99);
    expect(component.current()).toBe(0);
    component.step(-1);
    expect(component.current()).toBe(0);
    host.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    component.choose(1);
    component.step(1);
    key(component, 'End');
    expect(component.current()).toBe(0);
    component.toggleRotation();
    expect(component.rotating()).toBe(false);
  });
  it('moves focus outside a slide before manual or externally controlled hiding', () => {
    const fixture = setup();
    const component = fixture.componentInstance.carousel();
    document.body.append(fixture.nativeElement);
    fixture.nativeElement.querySelector('input').focus();
    component.choose(1);
    fixture.detectChanges();
    expect(document.activeElement).toBe(component.viewport()?.nativeElement);
    fixture.nativeElement.querySelector('.slide:not([hidden]) button').focus();
    fixture.componentInstance.index = 2;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(document.activeElement).toBe(component.viewport()?.nativeElement);
    fixture.nativeElement.remove();
  });
  it('supports directional swipes, ignores controls/vertical gestures and cancels pointers', () => {
    const fixture = setup();
    const component = fixture.componentInstance.carousel();
    const viewport = component.viewport()?.nativeElement;
    if (!viewport) throw new Error('Expected carousel viewport');
    viewport.setPointerCapture = jest.fn();
    const pointer = (extra: object = {}) =>
      ({
        button: 0,
        pointerId: 1,
        clientX: 100,
        clientY: 100,
        target: viewport,
        currentTarget: viewport,
        ...extra,
      }) as unknown as PointerEvent;
    component.pointerStart(
      pointer({ target: fixture.nativeElement.querySelector('input') }),
    );
    component.pointerEnd(pointer({ clientX: 0 }));
    expect(component.current()).toBe(0);
    component.pointerStart(pointer());
    component.pointerEnd(pointer({ pointerId: 2, clientX: 0 }));
    expect(component.current()).toBe(0);
    component.pointerEnd(pointer({ clientX: 0 }), true);
    expect(component.current()).toBe(0);
    component.pointerStart(pointer());
    component.pointerEnd(pointer({ clientX: 80, clientY: 0 }));
    expect(component.current()).toBe(0);
    component.pointerStart(pointer());
    component.pointerEnd(pointer({ clientX: 0 }));
    expect(component.current()).toBe(1);
    component.pointerStart(pointer());
    component.pointerEnd(pointer({ clientX: 200 }));
    expect(component.current()).toBe(0);
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ direction: 'rtl' } as CSSStyleDeclaration);
    component.pointerStart(pointer());
    component.pointerEnd(pointer({ clientX: 200 }));
    expect(component.current()).toBe(1);
    component.pointerStart(pointer({ button: 2 }));
    component.pointerEnd(pointer({ clientX: 200 }));
    expect(component.current()).toBe(1);
  });
  it('only rotates on opt-in, pauses on hover/focus, resumes explicitly and cleans up', () => {
    jest.useFakeTimers();
    const fixture = setup();
    const host = fixture.componentInstance;
    const component = host.carousel();
    jest.advanceTimersByTime(2000);
    expect(component.current()).toBe(0);
    host.auto = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.running()).toBe(true);
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(component.current()).toBe(1);
    component.hovered.set(true);
    fixture.detectChanges();
    jest.advanceTimersByTime(3000);
    expect(component.current()).toBe(1);
    component.hovered.set(false);
    component.focusEntered();
    fixture.detectChanges();
    jest.advanceTimersByTime(3000);
    expect(component.current()).toBe(1);
    component.toggleRotation();
    fixture.detectChanges();
    expect(component.running()).toBe(true);
    component.toggleRotation();
    fixture.detectChanges();
    expect(component.running()).toBe(false);
    component.toggleRotation();
    fixture.detectChanges();
    host.loop = false;
    component.choose(2, true);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(component.paused()).toBe(true);
    fixture.destroy();
    const final = component.current();
    jest.advanceTimersByTime(5000);
    expect(component.current()).toBe(final);
  });
  it('honors reduced-motion changes and removes media listeners', () => {
    const remove = jest.fn();
    let callback: (() => void) | undefined;
    const query = {
      matches: true,
      addEventListener: jest.fn((_type, cb) => {
        callback = cb;
      }),
      removeEventListener: remove,
    };
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn(() => query),
    });
    const fixture = setup();
    fixture.componentInstance.auto = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const component = fixture.componentInstance.carousel();
    expect(component.reducedMotion()).toBe(true);
    component.toggleRotation();
    expect(component.running()).toBe(false);
    query.matches = false;
    callback?.();
    fixture.detectChanges();
    expect(component.reducedMotion()).toBe(false);
    fixture.destroy();
    expect(remove).toHaveBeenCalled();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: undefined,
    });
  });
  it('localizes empty and positional copy', () => {
    TestBed.configureTestingModule({
      providers: [
        provideJpMessages({
          carousel: {
            empty: 'Aucune fiche',
            slide: ({ index, total }) => `${index}/${total}`,
            carouselRole: 'carrousel',
          },
        }),
      ],
    });
    const fixture = TestBed.createComponent(JpCarousel);
    fixture.componentRef.setInput('id', 'empty');
    fixture.componentRef.setInput('label', 'Guide');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Aucune fiche');
    expect(fixture.componentInstance.position()).toBe('0/0');
    fixture.componentInstance.step(1);
    fixture.componentInstance.choose(0);
    expect(fixture.componentInstance.current()).toBe(0);
  });
});
