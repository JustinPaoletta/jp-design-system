import { CommonModule } from '@angular/common';
import {
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
  selector: 'jp-stack',
  imports: [CommonModule],
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-stack',
  },
})
export class JpStack {
  readonly as = input<JpLayoutTag, unknown>('div', {
    transform: createStringUnionTransform(JP_LAYOUT_TAGS, 'div'),
  });

  readonly gap = input<JpSpaceToken, unknown>('md', {
    transform: createStringUnionTransform(JP_SPACE_TOKENS, 'md'),
  });

  readonly align = input<JpAlignItems, unknown>('stretch', {
    transform: createStringUnionTransform(JP_ALIGN_ITEMS, 'stretch'),
  });

  readonly justify = input<JpJustifyContent, unknown>('start', {
    transform: createStringUnionTransform(JP_JUSTIFY_CONTENT, 'start'),
  });

  readonly tag = computed(() => this.as());

  readonly rootGap = computed(() => spaceTokenToCssVar(this.gap()));

  readonly rootAlignItems = computed(() => alignItemsToCssValue(this.align()));

  readonly rootJustifyContent = computed(() =>
    justifyContentToCssValue(this.justify()),
  );
}
