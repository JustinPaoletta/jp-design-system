import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type JpFontWeight,
  JP_FONT_WEIGHTS,
  type JpTextSize,
  JP_TEXT_SIZES,
  type JpTextTag,
  JP_TEXT_TAGS,
  type JpTextTone,
  JP_TEXT_TONES,
} from '../shared/primitive-types';
import {
  createStringUnionTransform,
  fontWeightToCssVar,
  textSizeToCssVar,
  textToneToCssVar,
} from '../shared/token-maps';

@Component({
  selector: 'jp-text',
  imports: [CommonModule],
  templateUrl: './text.html',
  styleUrl: './text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-text',
  },
})
export class JpText {
  readonly as = input<JpTextTag, unknown>('p', {
    transform: createStringUnionTransform(JP_TEXT_TAGS, 'p'),
  });

  readonly size = input<JpTextSize, unknown>('body', {
    transform: createStringUnionTransform(JP_TEXT_SIZES, 'body'),
  });

  readonly tone = input<JpTextTone, unknown>('primary', {
    transform: createStringUnionTransform(JP_TEXT_TONES, 'primary'),
  });

  readonly weight = input<JpFontWeight, unknown>('regular', {
    transform: createStringUnionTransform(JP_FONT_WEIGHTS, 'regular'),
  });

  readonly truncate = input(false, { transform: booleanAttribute });

  readonly mono = input(false, { transform: booleanAttribute });

  readonly forId = input<string | null>(null);

  readonly tag = computed(() => this.as());

  readonly rootFontSize = computed(() => textSizeToCssVar(this.size()));

  readonly rootColor = computed(() => textToneToCssVar(this.tone()));

  readonly rootFontWeight = computed(() => fontWeightToCssVar(this.weight()));

  readonly rootFontFamily = computed(() =>
    this.mono() ? 'var(--jp-font-family-mono)' : 'var(--jp-font-family-base)',
  );

  readonly rootWhiteSpace = computed(() =>
    this.truncate() ? 'nowrap' : 'normal',
  );

  readonly rootOverflow = computed(() =>
    this.truncate() ? 'hidden' : 'visible',
  );

  readonly rootTextOverflow = computed(() =>
    this.truncate() ? 'ellipsis' : 'clip',
  );
}
