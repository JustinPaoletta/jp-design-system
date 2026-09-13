import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type JpButtonType,
  JP_BUTTON_TYPES,
  type JpControlSize,
  JP_CONTROL_SIZES,
} from '../shared/primitive-types';
import {
  controlSizeToCssVar,
  createStringUnionTransform,
} from '../shared/token-maps';

@Component({
  selector: 'jp-icon-button',
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-icon-button',
    '[class.jp-icon-button--sm]': 'size() === "sm"',
    '[class.jp-icon-button--md]': 'size() === "md"',
    '[class.jp-icon-button--lg]': 'size() === "lg"',
    '[class.jp-icon-button--disabled]': 'disabled()',
  },
})
export class JpIconButton {
  readonly ariaLabel = input.required<string>();

  readonly size = input<JpControlSize, unknown>('md', {
    transform: createStringUnionTransform(JP_CONTROL_SIZES, 'md'),
  });

  readonly type = input<JpButtonType, unknown>('button', {
    transform: createStringUnionTransform(JP_BUTTON_TYPES, 'button'),
  });

  readonly disabled = input(false, { transform: booleanAttribute });

  readonly rootSize = computed(() => controlSizeToCssVar(this.size()));
}
