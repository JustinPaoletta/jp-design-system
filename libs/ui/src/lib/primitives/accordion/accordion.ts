import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';
import { JP_DISCLOSURE_GROUP } from '../disclosure/disclosure-group';
let nextAccordionId = 0;
@Component({
  selector: 'jp-accordion',
  providers: [
    {
      provide: JP_DISCLOSURE_GROUP,
      useFactory: (accordion: JpAccordion) => () =>
        accordion.multiple() ? null : accordion.id() || accordion.generatedId,
      deps: [JpAccordion],
    },
  ],

  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpAccordion {
  readonly generatedId = `jp-accordion-${++nextAccordionId}`;
  readonly id = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly label = input.required<string>();
}
