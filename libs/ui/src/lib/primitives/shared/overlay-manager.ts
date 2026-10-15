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
  const update = () => {
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
    panel.style.maxHeight = `${Math.max(0, height - 2 * edge)}px`;
    const p = panel.getBoundingClientRect();
    let left = a.left;
    let top = a.bottom + gap;
    if (placement === 'top') top = a.top - p.height - gap;
    if (placement === 'left' || placement === 'right') {
      top = a.top + (a.height - p.height) / 2;
      left = placement === 'left' ? a.left - p.width - gap : a.right + gap;
      if (left < offsetLeft + edge) left = a.right + gap;
      if (left + p.width > viewportRight - edge) left = a.left - p.width - gap;
    } else {
      if (placement === 'top' && top < offsetTop + edge) top = a.bottom + gap;
      if (
        placement === 'bottom' &&
        top + p.height > viewportBottom - edge &&
        a.top - offsetTop > viewportBottom - a.bottom
      )
        top = a.top - p.height - gap;
    }
    panel.style.left = `${Math.max(offsetLeft + edge, Math.min(left, viewportRight - p.width - edge))}px`;
    panel.style.top = `${Math.max(offsetTop + edge, Math.min(top, viewportBottom - p.height - edge))}px`;
    panel.style.maxHeight = `${Math.max(0, height - 2 * edge)}px`;
  };
  update();
  win.addEventListener('resize', update);
  doc.addEventListener('scroll', update, true);
  win.visualViewport?.addEventListener('resize', update);
  win.visualViewport?.addEventListener('scroll', update);
  const observer =
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(update);
  observer?.observe(panel);
  observer?.observe(anchor);
  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    win.removeEventListener('resize', update);
    doc.removeEventListener('scroll', update, true);
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
