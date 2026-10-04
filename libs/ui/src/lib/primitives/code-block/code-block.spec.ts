import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { JpCodeBlock, JpInlineCode } from './code-block';
@Component({
  imports: [JpInlineCode],
  template: '<code jpInlineCode>&lt;script&gt;</code>',
})
class Host {}
describe('JpCodeBlock', () => {
  it('renders code as escaped text and offers selectable, keyboard-scrollable source', async () => {
    await TestBed.configureTestingModule({
      imports: [JpCodeBlock],
    }).compileComponents();
    const f = TestBed.createComponent(JpCodeBlock);
    f.componentRef.setInput('label', 'Example');
    f.componentRef.setInput(
      'code',
      '<img src=x onerror=alert(1)>\nconst value = 1;',
    );
    f.componentRef.setInput('language', 'TypeScript');
    f.detectChanges();
    expect(f.nativeElement.querySelector('code').textContent).toContain(
      '<img src=x',
    );
    expect(f.nativeElement.querySelector('img')).toBeNull();
    expect(f.nativeElement.querySelector('pre').tabIndex).toBe(0);
    expect(f.nativeElement.textContent).toContain('TypeScript');
    expect(f.nativeElement.querySelector('jp-copy-button')).not.toBeNull();
    f.componentRef.setInput('copyable', false);
    f.detectChanges();
    expect(f.nativeElement.querySelector('jp-copy-button')).toBeNull();
  });
  it('keeps inline code native and token-styled without treating it as HTML', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const code = f.nativeElement.querySelector('code') as HTMLElement;
    expect(code.textContent).toBe('<script>');
    expect(code.style.fontFamily).toContain('--jp-font-family-mono');
  });
});
