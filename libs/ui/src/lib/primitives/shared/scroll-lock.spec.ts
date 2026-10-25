import { lockDocumentScroll } from './scroll-lock';
describe('modal document scroll lock', () => {
  it('restores separate overflow axes and their priorities', () => {
    const doc = document.implementation.createHTMLDocument();
    doc.documentElement.style.setProperty('overflow-y', 'scroll', 'important');
    doc.body.style.setProperty('overflow-x', 'clip');
    doc.body.style.setProperty('overflow-y', 'auto', 'important');
    const release = lockDocumentScroll(doc);
    release();
    expect(doc.documentElement.style.overflowX).toBe('');
    expect(doc.documentElement.style.overflowY).toBe('scroll');
    expect(doc.documentElement.style.getPropertyPriority('overflow-y')).toBe(
      'important',
    );
    expect(doc.body.style.overflowX).toBe('clip');
    expect(doc.body.style.overflowY).toBe('auto');
    expect(doc.body.style.getPropertyPriority('overflow-y')).toBe('important');
  });
  it.each([false, true])(
    'preserves layout when a scrollbar disappears (stable gutter: %s)',
    (stable) => {
      const root = document.documentElement;
      const original = Object.getOwnPropertyDescriptor(root, 'clientWidth');
      Object.defineProperty(root, 'clientWidth', {
        configurable: true,
        value: window.innerWidth - 16,
      });
      root.style.scrollbarGutter = stable ? 'stable' : '';
      document.body.style.paddingRight = '12px';
      const release = lockDocumentScroll(document);
      expect(document.body.style.paddingRight).toBe(stable ? '12px' : '28px');
      release();
      expect(document.body.style.paddingRight).toBe('12px');
      document.body.style.removeProperty('padding-right');
      root.style.removeProperty('scrollbar-gutter');
      if (original) Object.defineProperty(root, 'clientWidth', original);
      else Reflect.deleteProperty(root, 'clientWidth');
    },
  );
  it('works in a document without a browser window', () => {
    const doc = document.implementation.createHTMLDocument();
    const release = lockDocumentScroll(doc);
    expect(doc.body.style.overflow).toBe('hidden');
    release();
    expect(doc.body.style.overflow).toBe('');
  });
  it('keeps nested locks and restores exact host styles after the last close', () => {
    document.documentElement.style.setProperty('overflow', 'auto', 'important');
    document.body.style.overflow = 'scroll';
    document.body.style.paddingRight = '12px';
    const releaseParent = lockDocumentScroll(document);
    const releaseChild = lockDocumentScroll(document);
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');
    releaseParent();
    releaseParent();
    expect(document.documentElement.style.overflow).toBe('hidden');
    releaseChild();
    expect(document.documentElement.style.overflow).toBe('auto');
    expect(document.documentElement.style.getPropertyPriority('overflow')).toBe(
      'important',
    );
    expect(document.body.style.overflow).toBe('scroll');
    expect(document.body.style.paddingRight).toBe('12px');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  });
});
