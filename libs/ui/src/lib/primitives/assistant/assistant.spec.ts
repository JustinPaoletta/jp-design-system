import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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

  it('streams responses and ignores updates after completion', () => {
    const id = service.beginResponse();
    expect(service.isPending()).toBe(true);
    service.updateResponse(id, 'Partial');
    expect(service.messages()[0].content).toBe('Partial');
    service.completeResponse(id, 'Complete');
    service.updateResponse(id, 'Late chunk');
    service.failResponse(id, 'Late error');
    expect(service.messages()[0].content).toBe('Complete');
    expect(service.messages()[0].responseStatus).toBe('complete');
    expect(service.isPending()).toBe(false);
  });

  it('retries a failed response with a fresh ID and ignores stale transport results', () => {
    const id = service.beginResponse('Draft');
    service.failResponse(id, 'Network unavailable');
    expect(service.messages()[0].error).toBe('Network unavailable');
    const nextId = service.retryResponse(id);
    expect(nextId).not.toBeNull();
    expect(nextId).not.toBe(id);
    expect(service.isPending()).toBe(true);
    service.completeResponse(id, 'Stale completion');
    expect(service.messages()[0].content).toBe('');
    service.completeResponse(nextId as number, 'Recovered');
    expect(service.messages()[0].content).toBe('Recovered');
    expect(service.retryResponse(nextId as number)).toBeNull();
    expect(service.retryResponse(-1)).toBeNull();
  });

  it('cancels pending responses and clearing conversation invalidates in-flight updates', () => {
    const id = service.beginResponse('Partial');
    service.cancelResponse(id);
    service.completeResponse(id, 'Late');
    expect(service.messages()[0].responseStatus).toBe('cancelled');
    expect(service.messages()[0].content).toBe('Partial');
    const pending = service.beginResponse();
    service.clearMessages();
    service.updateResponse(pending, 'Stale');
    expect(service.messages()).toEqual([]);
    expect(service.isPending()).toBe(false);
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
    fixture.componentRef.setInput('messageRole', 'user');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('jp-assistant-message--user'),
    ).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Hello');

    fixture.componentRef.setInput('messageRole', 'bad' as never);
    fixture.detectChanges();
    expect(fixture.componentInstance.messageRole()).toBe('assistant');
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

  it('keeps the draft when Enter confirms composed text', () => {
    service.open();
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.directive(JpAssistantPanel))
      .componentInstance as JpAssistantPanel;
    panel.draft.set('Who drove in the go-ahead run?');
    const compositionEnter = new KeyboardEvent('keydown', {
      key: 'Enter',
      isComposing: true,
      cancelable: true,
    });
    panel.onComposerKeydown(compositionEnter);
    expect(compositionEnter.defaultPrevented).toBe(false);
    expect(service.messages()).toHaveLength(0);
    expect(panel.draft()).toBe('Who drove in the go-ahead run?');

    panel.onComposerKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(service.messages()[0]?.content).toBe(
      'Who drove in the go-ahead run?',
    );
    expect(panel.draft()).toBe('');
  });

  it('blocks duplicate submits while pending and exposes retry/cancel events', () => {
    service.open();
    const id = service.beginResponse();
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.directive(JpAssistantPanel))
      .componentInstance as JpAssistantPanel;
    const cancel = jest.fn();
    const retry = jest.fn();
    panel.responseCancel.subscribe(cancel);
    panel.responseRetry.subscribe(retry);
    panel.draft.set('Do not duplicate');
    panel.submit();
    expect(service.messages()).toHaveLength(1);
    expect(
      fixture.nativeElement.querySelector('[role="progressbar"]'),
    ).toBeTruthy();
    panel.cancelResponse(id);
    expect(cancel).toHaveBeenCalledWith(id);
    panel.retryResponse(id);
    expect(retry).toHaveBeenCalledWith({
      previousId: id,
      responseId: service.messages()[0].id,
    });
    service.failResponse(service.messages()[0].id, 'Network unavailable');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role="alert"]').textContent,
    ).toContain('Network unavailable');
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

  it('includes the named conversation in the mobile keyboard focus cycle', () => {
    service.open();
    const panel = fixture.debugElement.query(By.directive(JpAssistantPanel))
      .componentInstance as JpAssistantPanel;
    panel.isMobileViewport.set(true);
    fixture.detectChanges();
    const close = fixture.nativeElement.querySelector(
      '.jp-assistant-panel__close',
    ) as HTMLElement;
    const log = fixture.nativeElement.querySelector(
      '[role="log"]',
    ) as HTMLElement;
    close.focus();
    close.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(document.activeElement).toBe(log);
    expect(log.getAttribute('aria-label')).toBeTruthy();
  });

  it('follows new exchanges while preserving a reader position until new messages are requested', () => {
    service.open();
    fixture.detectChanges();
    const log = fixture.nativeElement.querySelector(
      '[role="log"]',
    ) as HTMLElement;
    let height = 400;
    Object.defineProperties(log, {
      clientHeight: { configurable: true, get: () => 100 },
      scrollHeight: { configurable: true, get: () => height },
    });
    service.addMessage({ role: 'user', content: 'First question' });
    fixture.detectChanges();
    expect(log.scrollTop).toBe(300);

    log.scrollTop = 100;
    log.dispatchEvent(new Event('scroll'));
    height = 500;
    service.addMessage({ role: 'assistant', content: 'New answer' });
    fixture.detectChanges();
    expect(log.scrollTop).toBe(100);
    const latest = fixture.nativeElement.querySelector(
      '.jp-assistant-panel__new-messages button',
    ) as HTMLButtonElement;
    expect(latest).toBeTruthy();
    latest.click();
    fixture.detectChanges();
    expect(log.scrollTop).toBe(400);
    expect(document.activeElement).toBe(log);
    height = 600;
    service.addMessage({ role: 'user', content: 'Following again' });
    fixture.detectChanges();
    expect(log.scrollTop).toBe(500);
    service.clearMessages();
    fixture.detectChanges();
    expect(log.scrollTop).toBe(0);
    expect(
      fixture.nativeElement.querySelector('.jp-assistant-panel__new-messages'),
    ).toBeNull();
  });

  it('moves outside focus into an open dock when it changes to a mobile overlay', () => {
    const panel = fixture.debugElement.query(By.directive(JpAssistantPanel))
      .componentInstance as JpAssistantPanel;
    panel.isMobileViewport.set(false);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(
      '#trigger',
    ) as HTMLElement;
    const outside = fixture.nativeElement.querySelector(
      '#bare-trigger',
    ) as HTMLElement;
    trigger.focus();
    service.open();
    fixture.detectChanges();
    outside.focus();
    panel.isMobileViewport.set(true);
    fixture.detectChanges();
    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('textarea'),
    );
    service.close();
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);
  });

  it('follows resized content only while the reader is at the end', () => {
    fixture.destroy();
    const original = globalThis.ResizeObserver;
    let resize = () => undefined;
    const disconnect = jest.fn();
    globalThis.ResizeObserver = jest.fn().mockImplementation((callback) => {
      resize = callback;
      return { observe: jest.fn(), disconnect };
    });
    const f = TestBed.createComponent(AssistantHost);
    try {
      f.detectChanges();
      service.open();
      service.addMessage({ role: 'assistant', content: 'Game summary' });
      f.detectChanges();
      const log = f.nativeElement.querySelector('[role=log]') as HTMLElement;
      let height = 400;
      Object.defineProperties(log, {
        clientHeight: { get: () => 100 },
        scrollHeight: { get: () => height },
      });
      resize();
      expect(log.scrollTop).toBe(300);
      log.scrollTop = 100;
      log.dispatchEvent(new Event('scroll'));
      height = 600;
      resize();
      expect(log.scrollTop).toBe(100);
      service.close();
      f.detectChanges();
      resize();
      expect(log.scrollTop).toBe(100);
    } finally {
      f.destroy();
      globalThis.ResizeObserver = original;
    }
    expect(disconnect).toHaveBeenCalled();
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
    const composer = fixture.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    composer.value = 'typed';
    composer.dispatchEvent(new Event('input', { bubbles: true }));
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
