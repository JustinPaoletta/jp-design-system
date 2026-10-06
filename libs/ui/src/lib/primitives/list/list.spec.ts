import { TestBed } from '@angular/core/testing';
import { JpList } from './list';
import { Component } from '@angular/core';
import { JpListItemTemplate } from './list';
@Component({
  imports: [JpList, JpListItemTemplate],
  template:
    '<jp-list [items]="items"><ng-template jpListItem let-item><button>{{ item.title }}</button></ng-template></jp-list>',
})
class Host {
  items = [{ id: 'a', title: 'Ada' }];
}
describe('JpList', () => {
  async function mount(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({
      imports: [JpList],
    }).compileComponents();
    const fixture = TestBed.createComponent(JpList);
    for (const [key, value] of Object.entries(inputs))
      fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
  }
  it('retains native list semantics with optional descriptions and metadata', async () => {
    const f = await mount({
      items: [
        { id: 'a', title: 'Ada', description: 'Maintainer', meta: 'Online' },
        { id: 'b', title: 'Grace' },
      ],
    });
    expect(f.nativeElement.querySelectorAll('ul > li')).toHaveLength(2);
    expect(f.nativeElement.querySelectorAll('p')).toHaveLength(1);
    expect(f.nativeElement.querySelectorAll('.meta')).toHaveLength(1);
  });
  it('provides typed item context to custom templates while keeping native list items', async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector('ul > li > button').textContent).toBe(
      'Ada',
    );
  });
});
