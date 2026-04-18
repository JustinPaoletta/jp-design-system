import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpBox } from './box';

describe('JpBox', () => {
  let fixture: ComponentFixture<JpBox>;
  let component: JpBox;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpBox],
    }).compileComponents();

    fixture = TestBed.createComponent(JpBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders default div root', () => {
    const root = fixture.nativeElement.querySelector('.jp-box__root');
    expect(root?.tagName).toBe('DIV');
    expect(component.rootPadding()).toBe('0 0');
  });

  it('inherits base padding when axis overrides are omitted', () => {
    fixture.componentRef.setInput('padding', 'lg');
    fixture.detectChanges();

    expect(component.rootPadding()).toBe(
      'var(--jp-space-lg) var(--jp-space-lg)',
    );
  });

  it('allows paddingX to clear horizontal padding explicitly', () => {
    fixture.componentRef.setInput('padding', 'lg');
    fixture.componentRef.setInput('paddingX', 'none');
    fixture.detectChanges();

    expect(component.rootPadding()).toBe('var(--jp-space-lg) 0');
  });

  it('allows paddingY to clear vertical padding explicitly', () => {
    fixture.componentRef.setInput('padding', 'lg');
    fixture.componentRef.setInput('paddingY', 'none');
    fixture.detectChanges();

    expect(component.rootPadding()).toBe('0 var(--jp-space-lg)');
  });

  it('renders requested semantic tag', () => {
    fixture.componentRef.setInput('as', 'section');
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.jp-box__root');
    expect(root?.tagName).toBe('SECTION');
  });

  it('falls back to defaults for invalid values', () => {
    fixture.componentRef.setInput('as', 'bad-value' as never);
    fixture.componentRef.setInput('padding', 'bad-value' as never);
    fixture.detectChanges();

    expect(component.as()).toBe('div');
    expect(component.padding()).toBe('none');
  });
});
