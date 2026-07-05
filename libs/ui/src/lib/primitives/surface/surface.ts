import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type JpBorderTone,
  JP_BORDER_TONES,
  type JpElevationToken,
  JP_ELEVATION_TOKENS,
  type JpLayoutTag,
  JP_LAYOUT_TAGS,
  type JpRadiusToken,
  JP_RADIUS_TOKENS,
  type JpSpaceToken,
  JP_SPACE_TOKENS,
  type JpSurfaceTone,
  JP_SURFACE_TONES,
} from '../shared/primitive-types';
import {
  borderToneToCssValue,
  createStringUnionTransform,
  elevationToCssVar,
  radiusTokenToCssVar,
  spaceTokenToCssVar,
  surfaceToneToCssVar,
} from '../shared/token-maps';

@Component({
  selector: 'jp-surface',
  imports: [CommonModule],
  templateUrl: './surface.html',
  styleUrl: './surface.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-surface',
  },
})
export class JpSurface {
  readonly as = input<JpLayoutTag, unknown>('section', {
    transform: createStringUnionTransform(JP_LAYOUT_TAGS, 'section'),
  });

  readonly tone = input<JpSurfaceTone, unknown>('raised', {
    transform: createStringUnionTransform(JP_SURFACE_TONES, 'raised'),
  });

  readonly padding = input<JpSpaceToken, unknown>('lg', {
    transform: createStringUnionTransform(JP_SPACE_TOKENS, 'lg'),
  });

  readonly radius = input<JpRadiusToken, unknown>('lg', {
    transform: createStringUnionTransform(JP_RADIUS_TOKENS, 'lg'),
  });

  readonly border = input<JpBorderTone, unknown>('default', {
    transform: createStringUnionTransform(JP_BORDER_TONES, 'default'),
  });

  readonly elevation = input<JpElevationToken, unknown>('raised', {
    transform: createStringUnionTransform(JP_ELEVATION_TOKENS, 'raised'),
  });

  readonly tag = computed(() => this.as());

  readonly rootBackground = computed(() => surfaceToneToCssVar(this.tone()));

  readonly rootPadding = computed(() => spaceTokenToCssVar(this.padding()));

  readonly rootRadius = computed(() => radiusTokenToCssVar(this.radius()));

  readonly rootBorder = computed(() => borderToneToCssValue(this.border()));

  readonly rootBoxShadow = computed(() => elevationToCssVar(this.elevation()));
}
