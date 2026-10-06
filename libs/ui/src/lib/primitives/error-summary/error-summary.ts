import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpLink } from '../link/link';
import { getFocusableElements } from '../shared/focus-trap';
export interface JpFieldError {
  controlId: string;
  message: string;
}
let nextSummaryId = 0;
@Component({
  selector: 'jp-error-summary',
  imports: [JpLink],
  templateUrl: './error-summary.html',
  styleUrl: './error-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpErrorSummary {
  private readonly messages = inject(JP_MESSAGES);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly generatedId = `jp-error-summary-${++nextSummaryId}`;
  readonly id = input('');
  readonly title = input(this.messages.forms.errorSummary);
  readonly errors = input.required<readonly JpFieldError[]>();
  readonly titleId = computed(() => `${this.id() || this.generatedId}-title`);
  /** Call after rendering a failed submission, rather than stealing focus on every update. */
  focus(): void {
    this.panel()?.nativeElement.focus();
  }
  focusControl(event: Event, controlId: string): void {
    const target =
      this.host.nativeElement.ownerDocument.getElementById(controlId);
    if (!target) return;
    event.preventDefault();
    const focusable = target.matches(
      'input, select, textarea, button, a[href], [tabindex]',
    )
      ? target
      : getFocusableElements(target)[0];
    focusable?.focus();
    target.scrollIntoView?.({ block: 'nearest' });
  }
}
