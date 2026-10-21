import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JpCopyButton } from '../copy-button/copy-button';
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
  it('preserves exact source and the copy input while rendering colored text nodes', () => {
    const fixture = TestBed.createComponent(JpCodeBlock);
    const source =
      '\tconst score = 5;\r\nconst markup = "<img src=x onerror=alert(1)>";\n';
    fixture.componentRef.setInput('label', 'Game summary');
    fixture.componentRef.setInput('code', source);
    fixture.componentRef.setInput('language', 'ts');
    fixture.detectChanges();
    const code = fixture.nativeElement.querySelector('code') as HTMLElement;
    expect(code.textContent).toBe(source);
    expect(code.querySelector('.syntax-keyword')?.textContent).toBe('const');
    expect(code.querySelector('.syntax-string')?.textContent).toBe(
      '"<img src=x onerror=alert(1)>"',
    );
    expect(code.querySelector('img')).toBeNull();
    const copy = fixture.debugElement.query(By.directive(JpCopyButton))
      .componentInstance as JpCopyButton;
    expect(copy.text()).toBe(source);
  });

  it('updates colors for code and language changes and can turn highlighting off', () => {
    const fixture = TestBed.createComponent(JpCodeBlock);
    fixture.componentRef.setInput('label', 'Game summary');
    fixture.componentRef.setInput('code', 'const runs = 5;');
    fixture.componentRef.setInput('language', 'ts');
    fixture.detectChanges();
    const code = fixture.nativeElement.querySelector('code') as HTMLElement;
    expect(code.querySelector('.syntax-keyword')?.textContent).toBe('const');

    fixture.componentRef.setInput('language', 'text');
    fixture.detectChanges();
    expect(code.querySelectorAll('span')).toHaveLength(1);
    expect(code.querySelector('.syntax-plain')?.textContent).toBe(
      'const runs = 5;',
    );

    fixture.componentRef.setInput('language', 'json');
    fixture.componentRef.setInput('code', '{"runs": 3, "final": true}');
    fixture.detectChanges();
    expect(code.textContent).toBe('{"runs": 3, "final": true}');
    expect(code.querySelector('.syntax-number')?.textContent).toBe('3');
    expect(code.querySelector('.syntax-keyword')?.textContent).toBe('true');

    fixture.componentRef.setInput('highlight', 'false');
    fixture.detectChanges();
    expect(code.querySelectorAll('span')).toHaveLength(1);
    expect(code.querySelector('.syntax-plain')?.textContent).toBe(
      '{"runs": 3, "final": true}',
    );
    fixture.componentRef.setInput('highlight', '');
    fixture.detectChanges();
    expect(code.querySelector('.syntax-number')?.textContent).toBe('3');
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
