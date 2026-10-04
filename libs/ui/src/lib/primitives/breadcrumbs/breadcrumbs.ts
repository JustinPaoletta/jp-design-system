import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';

export type JpBreadcrumb = {
  label: string;
  href?: string;
};

/** The final item is the current page and is always rendered as text. */
@Component({
  selector: 'jp-breadcrumbs',
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'jp-breadcrumbs' },
})
export class JpBreadcrumbs {
  private readonly messages = inject(JP_MESSAGES);
  readonly items = input<readonly JpBreadcrumb[]>([]);
  readonly ariaLabel = input(this.messages.breadcrumbs.label);
}
