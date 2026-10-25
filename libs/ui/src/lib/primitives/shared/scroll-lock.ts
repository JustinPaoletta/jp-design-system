interface ScrollLock {
  count: number;
  restore: () => void;
}
const locks = new WeakMap<Document, ScrollLock>();

/** Keep modal background scrolling disabled until the last modal closes. */
export function lockDocumentScroll(doc: Document): () => void {
  let lock = locks.get(doc);
  if (!lock) {
    const root = doc.documentElement,
      body = doc.body,
      win = doc.defaultView;
    const styles: [HTMLElement, string, string, string][] = [];
    const save = (element: HTMLElement, property: string) =>
      styles.push([
        element,
        property,
        element.style.getPropertyValue(property),
        element.style.getPropertyPriority(property),
      ]);
    save(root, 'overflow');
    save(root, 'overflow-x');
    save(root, 'overflow-y');
    save(body, 'overflow');
    save(body, 'overflow-x');
    save(body, 'overflow-y');
    save(body, 'padding-right');
    const gutter =
      root.clientWidth && win
        ? Math.max(0, win.innerWidth - root.clientWidth)
        : 0;
    if (
      win &&
      gutter &&
      !(win.getComputedStyle(root).scrollbarGutter ?? '').includes('stable')
    ) {
      const padding = parseFloat(win.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${padding + gutter}px`;
    }
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    lock = {
      count: 0,
      restore: () => {
        for (const [element, property, value, priority] of styles) {
          if (value) element.style.setProperty(property, value, priority);
          else element.style.removeProperty(property);
        }
      },
    };
    locks.set(doc, lock);
  }
  lock.count++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--lock.count) return;
    lock.restore();
    locks.delete(doc);
  };
}
