import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JpStack } from './stack';

describe('JpStack', () => {
  let fixture: ComponentFixture<JpStack>;
  let component: JpStack;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpStack],
    }).compileComponents();

    fixture = TestBed.createComponent(JpStack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('uses default token mappings', () => {
    expect(component.rootGap()).toBe('var(--jp-space-md)');
    expect(component.rootAlignItems()).toBe('stretch');
    expect(component.rootJustifyContent()).toBe('flex-start');
  });

  it('applies non-default mapped values', () => {
    fixture.componentRef.setInput('gap', 'xl');
    fixture.componentRef.setInput('align', 'center');
    fixture.componentRef.setInput('justify', 'between');
    fixture.detectChanges();

    expect(component.rootGap()).toBe('var(--jp-space-xl)');
    expect(component.rootAlignItems()).toBe('center');
    expect(component.rootJustifyContent()).toBe('space-between');
  });

  it('falls back to defaults for invalid values', () => {
    fixture.componentRef.setInput('gap', 'bad' as never);
    fixture.componentRef.setInput('align', 'bad' as never);
    fixture.detectChanges();

    expect(component.gap()).toBe('md');
    expect(component.align()).toBe('stretch');
  });
});
