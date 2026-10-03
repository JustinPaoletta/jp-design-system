import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
  readonly items = input<readonly JpBreadcrumb[]>([]);
  readonly ariaLabel = input('Breadcrumb');
}
