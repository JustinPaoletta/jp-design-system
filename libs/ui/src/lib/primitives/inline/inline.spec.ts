import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpInline } from './inline';

describe('JpInline', () => {
  let fixture: ComponentFixture<JpInline>;
  let component: JpInline;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpInline],
    }).compileComponents();

    fixture = TestBed.createComponent(JpInline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses default values', () => {
    expect(component.rootGap()).toBe('var(--jp-space-sm)');
    expect(component.rootWrap()).toBe('wrap');
  });

  it('supports semantic tag switching', () => {
    fixture.componentRef.setInput('as', 'nav');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.jp-inline__root');
    expect(root?.tagName).toBe('NAV');
  });

  it('coerces invalid values to defaults', () => {
    fixture.componentRef.setInput('justify', 'invalid' as never);
    fixture.componentRef.setInput('gap', 'invalid' as never);
    fixture.detectChanges();

    expect(component.justify()).toBe('start');
    expect(component.gap()).toBe('sm');
  });
});
