import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { JpHeading } from '../heading/heading';
import { type JpHeadingTag } from '../shared/primitive-types';
@Component({
  selector: 'jp-card',
  imports: [JpHeading],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpCard {
  readonly title = input('');
  readonly headingLevel = input<JpHeadingTag>('h2');
}
