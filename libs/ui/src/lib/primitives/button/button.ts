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
  type JpButtonVariant,
  JP_BUTTON_VARIANTS,
  type JpControlSize,
  JP_CONTROL_SIZES,
} from '../shared/primitive-types';
import {
  controlSizeToCssVar,
  createStringUnionTransform,
} from '../shared/token-maps';

@Component({
  selector: 'jp-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-button',
    '[class.jp-button--primary]': 'variant() === "primary"',
    '[class.jp-button--secondary]': 'variant() === "secondary"',
    '[class.jp-button--ghost]': 'variant() === "ghost"',
    '[class.jp-button--destructive]': 'variant() === "destructive"',
    '[class.jp-button--sm]': 'size() === "sm"',
    '[class.jp-button--md]': 'size() === "md"',
    '[class.jp-button--lg]': 'size() === "lg"',
    '[class.jp-button--disabled]': 'disabled()',
  },
})
export class JpButton {
  readonly variant = input<JpButtonVariant, unknown>('primary', {
    transform: createStringUnionTransform(JP_BUTTON_VARIANTS, 'primary'),
  });

  readonly size = input<JpControlSize, unknown>('md', {
    transform: createStringUnionTransform(JP_CONTROL_SIZES, 'md'),
  });

  readonly type = input<JpButtonType, unknown>('button', {
    transform: createStringUnionTransform(JP_BUTTON_TYPES, 'button'),
  });

  readonly disabled = input(false, { transform: booleanAttribute });

  readonly rootHeight = computed(() => controlSizeToCssVar(this.size()));
}
