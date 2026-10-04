import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { JpHeading } from '../heading/heading';
import { type JpHeadingTag } from '../shared/primitive-types';
@Component({
  selector: 'jp-page-header',
  imports: [JpHeading],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpPageHeader {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly headingLevel = input<JpHeadingTag>('h1');
}
