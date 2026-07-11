import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JpButton } from '../button/button';
import { JpAssistantMessage } from './assistant-message';
import { JpAssistantPanel } from './assistant-panel';
import { JpAssistantTrigger } from './assistant-trigger';
import { JpAssistantService } from './assistant.service';

@Component({
  standalone: true,
  imports: [JpAssistantPanel, JpAssistantTrigger, JpButton],
  template: `
    <button
      type="button"
      id="trigger"
      jpAssistantTrigger
      [jpAssistantContext]="context"
    >
      Ask about this
    </button>
    <button
      type="button"
      id="bare-trigger"
      jpAssistantTrigger
      [jpAssistantClearMessages]="true"
    >
      Open bare
    </button>
    <jp-assistant-panel
      title="JP Assistant"
      (messageSubmit)="onSubmit($event)"
    />
  `,
})
class AssistantHost {
  context = {
    label: 'Deployment dep-1042',
    description: 'Production rollout',
    entityType: 'deployment',
    entityId: 'dep-1042',
  };
  lastSubmit = '';

  onSubmit(value: string): void {
    this.lastSubmit = value;
  }
}

describe('JpAssistantService', () => {
  let service: JpAssistantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JpAssistantService);
    service.close();
    service.clearContext();
    service.clearMessages();
  });

  it('opens with optional context and clears messages when requested', () => {
    service.addMessage({ role: 'system', content: 'stale' });
    service.open({
      context: { label: 'Row 12' },
      clearMessages: true,
    });

    expect(service.isOpen()).toBe(true);
    expect(service.context()?.label).toBe('Row 12');
    expect(service.messages()).toEqual([]);
  });

  it('toggles open state and manages messages', () => {
    service.toggle();
    expect(service.isOpen()).toBe(true);
    const id = service.addMessage({
      role: 'assistant',
      content: 'Hello',
    });
    expect(id).toBeGreaterThan(0);
    expect(service.messages()).toHaveLength(1);
    service.toggle();
    expect(service.isOpen()).toBe(false);
    service.clearMessages();
    expect(service.messages()).toEqual([]);
  });

  it('sets and clears context', () => {
    service.setContext({ label: 'Filter set' });
    expect(service.context()?.label).toBe('Filter set');
    service.clearContext();
    expect(service.context()).toBeNull();
  });
});

describe('JpAssistantMessage', () => {
  it('applies role host classes and falls back for invalid roles', () => {
    const fixture = TestBed.createComponent(JpAssistantMessage);
    fixture.componentRef.setInput('content', 'Hello');
    fixture.componentRef.setInput('role', 'user');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('jp-assistant-message--user'),
    ).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Hello');

    fixture.componentRef.setInput('role', 'bad' as never);
    fixture.detectChanges();
    expect(fixture.componentInstance.role()).toBe('assistant');
  });
});

describe('JpAssistantPanel + trigger', () => {
  let fixture: ComponentFixture<AssistantHost>;
  let service: JpAssistantService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantHost],
    }).compileComponents();

    service = TestBed.inject(JpAssistantService);
    service.close();
    service.clearContext();
    service.clearMessages();

    fixture = TestBed.createComponent(AssistantHost);
    fixture.detectChanges();
  });

  it('opens from context trigger and shows context chip', () => {
    const trigger = fixture.nativeElement.querySelector(
      '#trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(service.isOpen()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Deployment dep-1042');
    expect(fixture.nativeElement.textContent).toContain('Production rollout');
    expect(
      fixture.nativeElement.querySelector('[role="complementary"]'),
    ).toBeTruthy();
  });

  it('opens bare trigger without context and clears messages', () => {
    service.addMessage({ role: 'system', content: 'stale' });
    service.setContext({ label: 'Prior' });

    const bare = fixture.nativeElement.querySelector(
      '#bare-trigger',
    ) as HTMLButtonElement;
    bare.click();
    fixture.detectChanges();

    expect(service.isOpen()).toBe(true);
    expect(service.messages()).toEqual([]);
    expect(service.context()).toBeNull();
  });

  it('closes on Escape and via close button', () => {
    service.open();
    fixture.detectChanges();

    const panel = fixture.debugElement.query(By.directive(JpAssistantPanel))
      .componentInstance as JpAssistantPanel;
    panel.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(service.isOpen()).toBe(false);

    service.open();
    fixture.detectChanges();
    const close = fixture.nativeElement.querySelector(
      '.jp-assistant-panel__close',
    ) as HTMLButtonElement;
    close.click();
    fixture.detectChanges();
    expect(service.isOpen()).toBe(false);
  });

  it('submits composer messages and emits messageSubmit', () => {
    service.open();
    fixture.detectChanges();

    const panel = fixture.debugElement.query(By.directive(JpAssistantPanel))
      .componentInstance as JpAssistantPanel;
    panel.draft.set('What is the status?');
    panel.submit();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastSubmit).toBe('What is the status?');
    expect(service.messages()).toHaveLength(1);
    expect(service.messages()[0].role).toBe('user');
    expect(service.messages()[0].content).toBe('What is the status?');
  });

  it('clears context from the chip dismiss control', () => {
    service.open({ context: { label: 'Deployment dep-1042' } });
    fixture.detectChanges();

    const clear = fixture.nativeElement.querySelector(
      '.jp-assistant-panel__context-clear',
    ) as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();

    expect(service.context()).toBeNull();
  });

  it('traps focus on mobile viewport when open', () => {
    const matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query.includes('48rem'),
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMedia,
    });

    const mobileFixture = TestBed.createComponent(AssistantHost);
    mobileFixture.detectChanges();

    const panel = mobileFixture.debugElement.query(
      By.directive(JpAssistantPanel),
    ).componentInstance as JpAssistantPanel;
    panel.ngOnInit();

    expect(panel.isMobileViewport()).toBe(true);
    expect(panel.trapFocus()).toBe(false);

    service.open();
    mobileFixture.detectChanges();
    expect(panel.trapFocus()).toBe(true);
  });

  it('ignores empty submits and Escape when closed', () => {
    const panel = fixture.debugElement.query(By.directive(JpAssistantPanel))
      .componentInstance as JpAssistantPanel;
    panel.submit();
    panel.onDocumentKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(service.messages()).toEqual([]);
    expect(service.isOpen()).toBe(false);
  });

  it('submits from Enter keydown and closes from scrim click', () => {
    service.open();
    fixture.detectChanges();

    const panel = fixture.debugElement.query(By.directive(JpAssistantPanel))
      .componentInstance as JpAssistantPanel;
    panel.draft.set('Enter send');
    panel.onComposerKeydown(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(service.messages()[0]?.content).toBe('Enter send');

    service.open();
    fixture.detectChanges();
    panel.onComposerKeydown(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true,
        bubbles: true,
      }),
    );
    panel.onDraftInput({
      target: { value: 'typed' },
    } as unknown as Event);
    expect(panel.draft()).toBe('typed');

    panel.onComposerKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(service.isOpen()).toBe(false);

    service.open();
    fixture.detectChanges();
    panel.onScrimClick();
    fixture.detectChanges();
    expect(service.isOpen()).toBe(false);
  });
});
