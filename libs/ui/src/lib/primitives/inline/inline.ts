import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type JpAlignItems,
  JP_ALIGN_ITEMS,
  type JpJustifyContent,
  JP_JUSTIFY_CONTENT,
  type JpLayoutTag,
  JP_LAYOUT_TAGS,
  type JpSpaceToken,
  JP_SPACE_TOKENS,
} from '../shared/primitive-types';
import {
  alignItemsToCssValue,
  createStringUnionTransform,
  justifyContentToCssValue,
  spaceTokenToCssVar,
} from '../shared/token-maps';

@Component({
  selector: 'jp-inline',
  imports: [CommonModule],
  templateUrl: './inline.html',
  styleUrl: './inline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-inline',
  },
})
export class JpInline {
  readonly as = input<JpLayoutTag, unknown>('div', {
    transform: createStringUnionTransform(JP_LAYOUT_TAGS, 'div'),
  });

  readonly gap = input<JpSpaceToken, unknown>('sm', {
    transform: createStringUnionTransform(JP_SPACE_TOKENS, 'sm'),
  });

  readonly align = input<JpAlignItems, unknown>('center', {
    transform: createStringUnionTransform(JP_ALIGN_ITEMS, 'center'),
  });

  readonly justify = input<JpJustifyContent, unknown>('start', {
    transform: createStringUnionTransform(JP_JUSTIFY_CONTENT, 'start'),
  });

  readonly wrap = input(true, { transform: booleanAttribute });

  readonly tag = computed(() => this.as());

  readonly rootGap = computed(() => spaceTokenToCssVar(this.gap()));

  readonly rootAlignItems = computed(() => alignItemsToCssValue(this.align()));

  readonly rootJustifyContent = computed(() =>
    justifyContentToCssValue(this.justify()),
  );

  readonly rootWrap = computed(() => (this.wrap() ? 'wrap' : 'nowrap'));
}
