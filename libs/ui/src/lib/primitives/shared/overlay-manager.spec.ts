import {
  claimOverlayEvent,
  positionOverlay,
  registerOverlay,
} from './overlay-manager';

describe('overlay coordination', () => {
  it('only dismisses the top overlay, including during the same dispatch', () => {
    const parent = {},
      child = {};
    const removeParent = registerOverlay(parent, document);
    const removeChild = registerOverlay(child, document);
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      cancelable: true,
    });
    expect(claimOverlayEvent(parent, event, document)).toBe(false);
    expect(claimOverlayEvent(child, event, document)).toBe(true);
    removeChild();
    expect(claimOverlayEvent(parent, event, document)).toBe(false);
    expect(claimOverlayEvent(parent, new Event('pointerdown'), document)).toBe(
      true,
    );
    removeParent();
  });

  it('does not prevent outside pointer focus and isolates documents', () => {
    const owner = {};
    const doc = document.implementation.createHTMLDocument();
    const unregister = registerOverlay(owner, doc);
    const event = new Event('pointerdown', { cancelable: true });
    expect(claimOverlayEvent(owner, event, doc)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
    unregister();
  });

  it('flips above a bottom-edge anchor and clamps the horizontal edge', () => {
    const anchor = document.createElement('button');
    const panel = document.createElement('div');
    document.body.append(anchor, panel);
    const width = window.innerWidth,
      height = window.innerHeight;
    jest.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
      left: width - 20,
      right: width,
      top: height - 30,
      bottom: height - 10,
      width: 20,
      height: 20,
    } as DOMRect);
    jest
      .spyOn(panel, 'getBoundingClientRect')
      .mockReturnValue({ width: 150, height: 100 } as DOMRect);
    const cleanup = positionOverlay(panel, anchor);
    expect(panel.style.left).toBe(`${width - 158}px`);
    expect(panel.style.top).toBe(`${height - 134}px`);
    expect(panel.getAttribute('popover')).toBe('manual');
    cleanup();
    anchor.remove();
    panel.remove();
  });
});

describe('native overlay lifecycle and viewport placement', () => {
  function elements() {
    const panel = document.createElement('div'),
      anchor = document.createElement('button');
    document.body.append(panel, anchor);
    jest
      .spyOn(panel, 'getBoundingClientRect')
      .mockReturnValue({ width: 100, height: 80 } as DOMRect);
    jest.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
      left: 120,
      right: 140,
      top: 120,
      bottom: 140,
      width: 20,
      height: 20,
    } as DOMRect);
    return {
      panel,
      anchor,
      remove: () => {
        panel.remove();
        anchor.remove();
      },
    };
  }

  it('skips detached panels and documents without a window', () => {
    const panel = document.createElement('div'),
      anchor = document.createElement('button');
    const show = jest.fn();
    panel.showPopover = show;
    positionOverlay(panel, anchor)();
    expect(show).not.toHaveBeenCalled();
    const doc = document.implementation.createHTMLDocument();
    doc.body.append(panel, anchor);
    positionOverlay(panel, anchor)();
    expect(show).not.toHaveBeenCalled();
  });

  it('recovers from native open failure and restores original inline styles', () => {
    const { panel, anchor, remove } = elements();
    panel.style.left = '3px';
    panel.style.setProperty('position', 'absolute', 'important');
    panel.showPopover = jest.fn(() => {
      throw new DOMException('Detached', 'InvalidStateError');
    });
    const cleanup = positionOverlay(panel, anchor);
    expect(panel.style.position).toBe('fixed');
    expect(panel.hasAttribute('popover')).toBe(false);
    cleanup();
    cleanup();
    expect(panel.style.left).toBe('3px');
    expect(panel.style.position).toBe('absolute');
    expect(panel.style.getPropertyPriority('position')).toBe('important');
    remove();
  });

  it('closes native panels once, tolerates state races and restores existing popover attributes', () => {
    const { panel, anchor, remove } = elements();
    panel.setAttribute('popover', 'auto');
    panel.showPopover = jest.fn();
    panel.hidePopover = jest.fn(() => {
      throw new DOMException('Closed', 'InvalidStateError');
    });
    const cleanup = positionOverlay(panel, anchor);
    cleanup();
    cleanup();
    expect(panel.hidePopover).toHaveBeenCalledTimes(1);
    expect(panel.getAttribute('popover')).toBe('auto');
    remove();
  });

  it('does not call native close after the panel was detached', () => {
    const { panel, anchor, remove } = elements();
    panel.showPopover = jest.fn();
    panel.hidePopover = jest.fn();
    const cleanup = positionOverlay(panel, anchor);
    panel.remove();
    cleanup();
    expect(panel.hidePopover).not.toHaveBeenCalled();
    remove();
  });

  it.each([
    ['top', 120, 36],
    ['bottom', 120, 144],
    ['left', 16, 90],
    ['right', 144, 90],
  ] as const)(
    'positions %s and updates on scrolling',
    (placement, left, top) => {
      const { panel, anchor, remove } = elements();
      const cleanup = positionOverlay(panel, anchor, placement);
      expect(panel.style.left).toBe(`${left}px`);
      expect(panel.style.top).toBe(`${top}px`);
      jest.mocked(anchor.getBoundingClientRect).mockReturnValue({
        left: 200,
        right: 220,
        top: 200,
        bottom: 220,
        width: 20,
        height: 20,
      } as DOMRect);
      document.dispatchEvent(new Event('scroll'));
      expect(panel.style.top).not.toBe(`${top}px`);
      cleanup();
      remove();
    },
  );

  it('flips top and side placements at viewport edges', () => {
    const { panel, anchor, remove } = elements();
    jest.mocked(anchor.getBoundingClientRect).mockReturnValue({
      left: 0,
      right: 20,
      top: 0,
      bottom: 20,
      width: 20,
      height: 20,
    } as DOMRect);
    let cleanup = positionOverlay(panel, anchor, 'top');
    expect(panel.style.top).toBe('24px');
    cleanup();
    cleanup = positionOverlay(panel, anchor, 'left');
    expect(panel.style.left).toBe('24px');
    cleanup();
    jest.mocked(anchor.getBoundingClientRect).mockReturnValue({
      left: window.innerWidth - 20,
      right: window.innerWidth,
      top: 100,
      bottom: 120,
      width: 20,
      height: 20,
    } as DOMRect);
    cleanup = positionOverlay(panel, anchor, 'right');
    expect(panel.style.left).toBe(`${window.innerWidth - 124}px`);
    cleanup();
    remove();
  });

  it('tracks the mobile visual viewport and disconnects observers', () => {
    const originalViewport = Object.getOwnPropertyDescriptor(
      window,
      'visualViewport',
    );
    const originalObserver = globalThis.ResizeObserver;
    const viewport = Object.assign(new EventTarget(), {
      width: 240,
      height: 180,
      offsetLeft: 30,
      offsetTop: 50,
    });
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport,
    });
    const observe = jest.fn(),
      disconnect = jest.fn();
    globalThis.ResizeObserver = jest
      .fn()
      .mockImplementation(() => ({ observe, disconnect }));
    const { panel, anchor, remove } = elements();
    const cleanup = positionOverlay(panel, anchor);
    expect(panel.style.maxWidth).toBe('224px');
    expect(panel.style.maxHeight).toBe('164px');
    expect(observe).toHaveBeenCalledTimes(2);
    viewport.offsetTop = 200;
    viewport.dispatchEvent(new Event('scroll'));
    expect(parseFloat(panel.style.top)).toBeGreaterThanOrEqual(208);
    cleanup();
    expect(disconnect).toHaveBeenCalledTimes(1);
    remove();
    globalThis.ResizeObserver = originalObserver;
    if (originalViewport)
      Object.defineProperty(window, 'visualViewport', originalViewport);
    else Reflect.deleteProperty(window, 'visualViewport');
  });
});
