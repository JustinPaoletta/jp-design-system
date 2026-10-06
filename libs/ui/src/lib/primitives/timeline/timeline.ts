import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
export interface JpTimelineEvent {
  id: string;
  title: string;
  description?: string;
  /** Visible time formatted by the application in its chosen locale/time zone. */
  timeLabel?: string;
  /** Machine-readable ISO date/time. Omit when the visible label is relative. */
  dateTime?: string;
}
@Component({
  selector: 'jp-timeline',
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpTimeline {
  private readonly messages = inject(JP_MESSAGES);
  readonly events = input.required<readonly JpTimelineEvent[]>();
  readonly label = input.required<string>();
  readonly emptyText = input(this.messages.timeline.empty);
}
