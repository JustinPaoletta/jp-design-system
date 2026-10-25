/** Coordinates dismissal so a nested panel closes without dismissing its parent. */
const stacks = new WeakMap<Document, object[]>();
const handled = new WeakSet<Event>();

export function registerOverlay(owner: object, document: Document): () => void {
  const stack = stacks.get(document) ?? [];
  if (!stack.includes(owner)) stack.push(owner);
  stacks.set(document, stack);
  return () => {
    const index = stack.indexOf(owner);
    if (index >= 0) stack.splice(index, 1);
  };
}

export function claimOverlayEvent(
  owner: object,
  event: Event,
  document: Document,
): boolean {
  const stack = stacks.get(document) ?? [];
  if (handled.has(event) || (stack.length && stack[stack.length - 1] !== owner))
    return false;
  handled.add(event);
  return true;
}

/** Native top layer escapes overflow/transform ancestors without reparenting Angular views. */
export function positionOverlay(
  panel: HTMLElement,
  anchor: HTMLElement,
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  resizeTargets: readonly Element[] = [],
): () => void {
  const doc = panel.ownerDocument;
  const win = doc.defaultView;
  if (!win || !panel.isConnected || !anchor.isConnected) return () => undefined;
  const originalPopover = panel.getAttribute('popover');
  const properties = [
    'position',
    'margin',
    'inset',
    'transform',
    'max-width',
    'overflow',
    'left',
    'top',
    'max-height',
  ];
  const originalStyles = properties.map((property) => [
    property,
    panel.style.getPropertyValue(property),
    panel.style.getPropertyPriority(property),
  ]);
  panel.setAttribute('popover', 'manual');
  let nativeOpen = false;
  try {
    if (panel.showPopover) {
      panel.showPopover();
      nativeOpen = true;
    }
  } catch {
    // Native state can change during rendering/teardown. Keep a usable fixed
    // fallback rather than aborting setup and leaking the owner's registration.
    panel.removeAttribute('popover');
  }
  // The popover attribute hides a closed panel even when the native API is
  // unavailable. Remove it for the fixed-position fallback as well.
  if (!nativeOpen) panel.removeAttribute('popover');
  panel.style.position = 'fixed';
  panel.style.margin = '0';
  panel.style.inset = 'auto';
  panel.style.transform = 'none';
  panel.style.maxWidth = 'calc(100vw - 16px)';
  panel.style.overflow = 'auto';
  const heightStyle = originalStyles.find(
    ([property]) => property === 'max-height',
  ) ?? ['max-height', '', ''];
  const update = () => {
    if (!panel.isConnected || !anchor.isConnected) return;
    const scrollTop = panel.scrollTop;
    const scrollLeft = panel.scrollLeft;
    const a = anchor.getBoundingClientRect();
    const edge = 8;
    const gap = 4;
    const viewport = win.visualViewport;
    const offsetLeft = viewport?.offsetLeft ?? 0;
    const offsetTop = viewport?.offsetTop ?? 0;
    const width = viewport?.width ?? win.innerWidth;
    const height = viewport?.height ?? win.innerHeight;
    const viewportRight = offsetLeft + width;
    const viewportBottom = offsetTop + height;
    panel.style.maxWidth = `${Math.max(0, width - 2 * edge)}px`;
    // Measure with the component's own height limit before choosing a side.
    // Reset our previous constraint so a resized viewport can grow the list.
    if (heightStyle[1])
      panel.style.setProperty('max-height', heightStyle[1], heightStyle[2]);
    else panel.style.removeProperty('max-height');
    const style = win.getComputedStyle(panel);
    const componentLimit = style.maxHeight.endsWith('px')
      ? parseFloat(style.maxHeight)
      : NaN;
    const boxExtra =
      style.boxSizing === 'border-box'
        ? 0
        : [
            'paddingTop',
            'paddingBottom',
            'borderTopWidth',
            'borderBottomWidth',
          ].reduce(
            (sum, property) =>
              sum +
              (parseFloat(
                style[property as keyof CSSStyleDeclaration] as string,
              ) || 0),
            0,
          );
    let p = panel.getBoundingClientRect();
    let side = placement;
    let available = Math.max(0, height - 2 * edge);
    if (placement === 'top' || placement === 'bottom') {
      const above = Math.max(
        0,
        Math.min(a.top - gap, viewportBottom - edge) - (offsetTop + edge),
      );
      const below = Math.max(
        0,
        viewportBottom - edge - Math.max(a.bottom + gap, offsetTop + edge),
      );
      const preferred = placement === 'top' ? above : below;
      const opposite = placement === 'top' ? below : above;
      if (p.height > preferred && opposite > preferred)
        side = placement === 'top' ? 'bottom' : 'top';
      available = side === 'top' ? above : below;
    }
    const limit = Math.max(0, available - boxExtra);
    panel.style.maxHeight = Number.isFinite(componentLimit)
      ? `${Math.min(componentLimit, limit)}px`
      : style.maxHeight && style.maxHeight !== 'none'
        ? `min(${style.maxHeight}, ${limit}px)`
        : `${limit}px`;
    p = panel.getBoundingClientRect();
    let left = a.left;
    let top = a.bottom + gap;
    if (side === 'top') top = a.top - p.height - gap;
    if (placement === 'left' || placement === 'right') {
      top = a.top + (a.height - p.height) / 2;
      left = placement === 'left' ? a.left - p.width - gap : a.right + gap;
      if (left < offsetLeft + edge) left = a.right + gap;
      if (left + p.width > viewportRight - edge) left = a.left - p.width - gap;
    }
    // Align text with device pixels so fractional anchor geometry does not
    // change glyph rasterization between otherwise identical panel layouts.
    const scale = win.devicePixelRatio || 1;
    const snap = (value: number) => Math.round(value * scale) / scale;
    panel.style.left = `${snap(Math.max(offsetLeft + edge, Math.min(left, viewportRight - p.width - edge)))}px`;
    panel.style.top = `${snap(Math.max(offsetTop + edge, Math.min(top, viewportBottom - p.height - edge)))}px`;
    panel.scrollTop = scrollTop;
    panel.scrollLeft = scrollLeft;
  };
  const onScroll = (event: Event) => {
    // Scrolling panel content does not move its anchor. Re-measuring here can
    // temporarily remove the height limit and reset the panel's scroll offset.
    if (!event.composedPath().includes(panel)) update();
  };
  update();
  win.addEventListener('resize', update);
  doc.addEventListener('scroll', onScroll, true);
  win.visualViewport?.addEventListener('resize', update);
  win.visualViewport?.addEventListener('scroll', update);
  const observer =
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(update);
  observer?.observe(panel);
  observer?.observe(anchor);
  for (const target of resizeTargets) observer?.observe(target);
  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    win.removeEventListener('resize', update);
    doc.removeEventListener('scroll', onScroll, true);
    win.visualViewport?.removeEventListener('resize', update);
    win.visualViewport?.removeEventListener('scroll', update);
    observer?.disconnect();
    if (nativeOpen && panel.isConnected) {
      try {
        panel.hidePopover?.();
      } catch {
        /* Already closed or no longer a native popover. */
      }
    }
    if (originalPopover === null) panel.removeAttribute('popover');
    else panel.setAttribute('popover', originalPopover);
    for (const [property, value, priority] of originalStyles) {
      if (value) panel.style.setProperty(property, value, priority);
      else panel.style.removeProperty(property);
    }
  };
}
