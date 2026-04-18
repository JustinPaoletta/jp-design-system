import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type JpBoxMaxWidth,
  JP_BOX_MAX_WIDTHS,
  type JpLayoutTag,
  JP_LAYOUT_TAGS,
  type JpSpaceToken,
  JP_SPACE_TOKENS,
} from '../shared/primitive-types';
import {
  createOptionalStringUnionTransform,
  createStringUnionTransform,
  maxWidthToCssVar,
  spaceTokenToCssVar,
} from '../shared/token-maps';

@Component({
  selector: 'jp-box',
  imports: [CommonModule],
  templateUrl: './box.html',
  styleUrl: './box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-box',
  },
})
export class JpBox {
  readonly as = input<JpLayoutTag, unknown>('div', {
    transform: createStringUnionTransform(JP_LAYOUT_TAGS, 'div'),
  });

  readonly padding = input<JpSpaceToken, unknown>('none', {
    transform: createStringUnionTransform(JP_SPACE_TOKENS, 'none'),
  });

  readonly paddingX = input<JpSpaceToken | null, unknown>(null, {
    transform: createOptionalStringUnionTransform(JP_SPACE_TOKENS),
  });

  readonly paddingY = input<JpSpaceToken | null, unknown>(null, {
    transform: createOptionalStringUnionTransform(JP_SPACE_TOKENS),
  });

  readonly maxWidth = input<JpBoxMaxWidth, unknown>('none', {
    transform: createStringUnionTransform(JP_BOX_MAX_WIDTHS, 'none'),
  });

  readonly tag = computed(() => this.as());

  readonly rootPadding = computed(() => {
    const basePadding = spaceTokenToCssVar(this.padding());
    const paddingY = this.paddingY();
    const paddingX = this.paddingX();
    const verticalPadding =
      paddingY === null ? basePadding : spaceTokenToCssVar(paddingY);
    const horizontalPadding =
      paddingX === null ? basePadding : spaceTokenToCssVar(paddingX);

    return `${verticalPadding} ${horizontalPadding}`;
  });

  readonly rootMaxWidth = computed(() => maxWidthToCssVar(this.maxWidth()));
}
