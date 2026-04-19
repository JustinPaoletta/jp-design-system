import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type JpGridColumns,
  JP_GRID_COLUMNS,
  type JpGridMinColumn,
  JP_GRID_MIN_COLUMNS,
  type JpGridMode,
  JP_GRID_MODES,
  type JpLayoutTag,
  JP_LAYOUT_TAGS,
  type JpSpaceToken,
  JP_SPACE_TOKENS,
} from '../shared/primitive-types';
import {
  createNumberUnionTransform,
  createStringUnionTransform,
  gridMinColumnToCssVar,
  spaceTokenToCssVar,
} from '../shared/token-maps';

@Component({
  selector: 'jp-grid',
  imports: [CommonModule],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-grid',
  },
})
export class JpGrid {
  readonly as = input<JpLayoutTag, unknown>('div', {
    transform: createStringUnionTransform(JP_LAYOUT_TAGS, 'div'),
  });

  readonly gap = input<JpSpaceToken, unknown>('md', {
    transform: createStringUnionTransform(JP_SPACE_TOKENS, 'md'),
  });

  readonly columns = input<JpGridColumns, unknown>(3, {
    transform: createNumberUnionTransform(JP_GRID_COLUMNS, 3),
  });

  readonly mode = input<JpGridMode, unknown>('fixed', {
    transform: createStringUnionTransform(JP_GRID_MODES, 'fixed'),
  });

  readonly minColumn = input<JpGridMinColumn, unknown>('md', {
    transform: createStringUnionTransform(JP_GRID_MIN_COLUMNS, 'md'),
  });

  readonly tag = computed(() => this.as());

  readonly rootGap = computed(() => spaceTokenToCssVar(this.gap()));

  readonly rootTemplateColumns = computed(() => {
    if (this.mode() === 'fixed') {
      return `repeat(${this.columns()}, minmax(0, 1fr))`;
    }

    return `repeat(auto-fit, minmax(${gridMinColumnToCssVar(this.minColumn())}, 1fr))`;
  });
}
