import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type JpFontWeight,
  JP_FONT_WEIGHTS,
  type JpHeadingTag,
  JP_HEADING_TAGS,
  type JpTextTone,
  JP_TEXT_TONES,
} from '../shared/primitive-types';
import {
  createStringUnionTransform,
  fontWeightToCssVar,
  headingLevelToCssVar,
  textToneToCssVar,
} from '../shared/token-maps';

@Component({
  selector: 'jp-heading',
  imports: [CommonModule],
  templateUrl: './heading.html',
  styleUrl: './heading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-heading',
  },
})
export class JpHeading {
  readonly as = input<JpHeadingTag, unknown>('h2', {
    transform: createStringUnionTransform(JP_HEADING_TAGS, 'h2'),
  });

  readonly tone = input<JpTextTone, unknown>('primary', {
    transform: createStringUnionTransform(JP_TEXT_TONES, 'primary'),
  });

  readonly weight = input<JpFontWeight, unknown>('semibold', {
    transform: createStringUnionTransform(JP_FONT_WEIGHTS, 'semibold'),
  });

  readonly tag = computed(() => this.as());

  readonly rootFontSize = computed(() => headingLevelToCssVar(this.as()));

  readonly rootColor = computed(() => textToneToCssVar(this.tone()));

  readonly rootFontWeight = computed(() => fontWeightToCssVar(this.weight()));
}
