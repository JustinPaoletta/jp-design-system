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
    '[class.jp-text--truncate]': 'truncate()',
    '[class.jp-text--block]': 'isBlockTag()',
    '[style.display]': 'hostDisplay()',
  },
})
export class JpText {
  private static readonly INLINE_TAGS = new Set<JpTextTag>([
    'span',
    'label',
    'small',
    'strong',
    'em',
  ]);

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

  readonly isBlockTag = computed(() => !JpText.INLINE_TAGS.has(this.tag()));

  readonly hostDisplay = computed(() => {
    if (this.truncate()) {
      return 'block';
    }

    return JpText.INLINE_TAGS.has(this.tag()) ? 'inline' : 'block';
  });

  readonly rootFontSize = computed(() => textSizeToCssVar(this.size()));

  readonly rootColor = computed(() => textToneToCssVar(this.tone()));

  readonly rootFontWeight = computed(() => fontWeightToCssVar(this.weight()));

  readonly rootFontFamily = computed(() =>
    this.mono() ? 'var(--jp-font-family-mono)' : 'var(--jp-font-family-base)',
  );
}
