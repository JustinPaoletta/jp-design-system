import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  type JpBadgeSize,
  JP_BADGE_SIZES,
  type JpBadgeTone,
  JP_BADGE_TONES,
} from '../shared/primitive-types';
import { createStringUnionTransform } from '../shared/token-maps';

@Component({
  selector: 'jp-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-badge',
    '[class.jp-badge--neutral]': 'tone() === "neutral"',
    '[class.jp-badge--accent]': 'tone() === "accent"',
    '[class.jp-badge--success]': 'tone() === "success"',
    '[class.jp-badge--warning]': 'tone() === "warning"',
    '[class.jp-badge--error]': 'tone() === "error"',
    '[class.jp-badge--info]': 'tone() === "info"',
    '[class.jp-badge--sm]': 'size() === "sm"',
    '[class.jp-badge--md]': 'size() === "md"',
  },
})
export class JpBadge {
  readonly tone = input<JpBadgeTone, unknown>('neutral', {
    transform: createStringUnionTransform(JP_BADGE_TONES, 'neutral'),
  });

  readonly size = input<JpBadgeSize, unknown>('md', {
    transform: createStringUnionTransform(JP_BADGE_SIZES, 'md'),
  });
}
