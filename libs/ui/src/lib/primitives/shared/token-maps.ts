import {
  type JpAlignItems,
  type JpBorderTone,
  type JpBoxMaxWidth,
  type JpElevationToken,
  type JpFontWeight,
  type JpGridMinColumn,
  type JpHeadingSize,
  type JpHeadingTag,
  type JpJustifyContent,
  type JpRadiusToken,
  type JpSpaceToken,
  type JpSurfaceTone,
  type JpTextSize,
  type JpTextTone,
} from './primitive-types';

const SPACE_TO_CSS_VAR: Record<JpSpaceToken, string> = {
  none: '0',
  '2xs': 'var(--jp-space-2xs)',
  xs: 'var(--jp-space-xs)',
  sm: 'var(--jp-space-sm)',
  md: 'var(--jp-space-md)',
  lg: 'var(--jp-space-lg)',
  xl: 'var(--jp-space-xl)',
  '2xl': 'var(--jp-space-2xl)',
  '3xl': 'var(--jp-space-3xl)',
};

const RADIUS_TO_CSS_VAR: Record<JpRadiusToken, string> = {
  none: 'var(--jp-radius-none)',
  sm: 'var(--jp-radius-sm)',
  md: 'var(--jp-radius-md)',
  lg: 'var(--jp-radius-lg)',
  xl: 'var(--jp-radius-xl)',
  full: 'var(--jp-radius-full)',
};

const MAX_WIDTH_TO_CSS_VAR: Record<JpBoxMaxWidth, string | null> = {
  none: null,
  narrow: 'var(--jp-size-container-narrow)',
  wide: 'var(--jp-size-container-wide)',
};

const ALIGN_TO_CSS_VALUE: Record<JpAlignItems, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const JUSTIFY_TO_CSS_VALUE: Record<JpJustifyContent, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
};

const SURFACE_TONE_TO_CSS_VAR: Record<JpSurfaceTone, string> = {
  canvas: 'var(--jp-color-surface-canvas)',
  sunken: 'var(--jp-color-surface-sunken)',
  subtle: 'var(--jp-color-surface-subtle)',
  raised: 'var(--jp-color-surface-raised)',
  overlay: 'var(--jp-color-surface-overlay)',
};

const BORDER_TO_CSS_VALUE: Record<JpBorderTone, string> = {
  none: '0 solid transparent',
  subtle: '1px solid var(--jp-color-border-subtle)',
  default: '1px solid var(--jp-color-border-default)',
  strong: '1px solid var(--jp-color-border-strong)',
};

const ELEVATION_TO_CSS_VAR: Record<JpElevationToken, string> = {
  none: 'var(--jp-elevation-none)',
  raised: 'var(--jp-elevation-raised)',
  floating: 'var(--jp-elevation-floating)',
  overlay: 'var(--jp-elevation-overlay)',
};

const TEXT_TONE_TO_CSS_VAR: Record<JpTextTone, string> = {
  primary: 'var(--jp-color-text-primary)',
  secondary: 'var(--jp-color-text-secondary)',
  muted: 'var(--jp-color-text-muted)',
  disabled: 'var(--jp-color-text-disabled)',
  inverse: 'var(--jp-color-text-inverse)',
};

const TEXT_SIZE_TO_CSS_VAR: Record<JpTextSize, string> = {
  caption: 'var(--jp-font-size-caption)',
  body: 'var(--jp-font-size-body)',
  'body-lg': 'var(--jp-font-size-body-lg)',
};

const HEADING_SIZE_TO_CSS_VAR: Record<
  Exclude<JpHeadingSize, 'auto'>,
  string
> = {
  title: 'var(--jp-font-size-title)',
  display: 'var(--jp-font-size-display)',
};

const FONT_WEIGHT_TO_CSS_VAR: Record<JpFontWeight, string> = {
  regular: 'var(--jp-font-weight-regular)',
  medium: 'var(--jp-font-weight-medium)',
  semibold: 'var(--jp-font-weight-semibold)',
  bold: 'var(--jp-font-weight-bold)',
};

const GRID_MIN_COLUMN_TO_CSS_VAR: Record<JpGridMinColumn, string> = {
  sm: 'var(--jp-size-column-min-sm)',
  md: 'var(--jp-size-column-min-md)',
  lg: 'var(--jp-size-column-min-lg)',
};

export function createStringUnionTransform<T extends string>(
  allowed: readonly T[],
  fallback: T,
) {
  const allowedSet = new Set<string>(allowed);

  return (value: unknown): T => {
    if (typeof value === 'string' && allowedSet.has(value)) {
      return value as T;
    }

    return fallback;
  };
}

export function createOptionalStringUnionTransform<T extends string>(
  allowed: readonly T[],
) {
  const allowedSet = new Set<string>(allowed);

  return (value: unknown): T | null => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return null;
    }

    if (typeof value === 'string' && allowedSet.has(value)) {
      return value as T;
    }

    return null;
  };
}

export function createNumberUnionTransform<T extends number>(
  allowed: readonly T[],
  fallback: T,
) {
  const allowedSet = new Set<number>(allowed);

  return (value: unknown): T => {
    if (typeof value === 'number' && allowedSet.has(value)) {
      return value as T;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsedValue = Number(value);
      if (Number.isInteger(parsedValue) && allowedSet.has(parsedValue)) {
        return parsedValue as T;
      }
    }

    return fallback;
  };
}

export function spaceTokenToCssVar(token: JpSpaceToken): string {
  return SPACE_TO_CSS_VAR[token];
}

export function radiusTokenToCssVar(token: JpRadiusToken): string {
  return RADIUS_TO_CSS_VAR[token];
}

export function maxWidthToCssVar(maxWidth: JpBoxMaxWidth): string | null {
  return MAX_WIDTH_TO_CSS_VAR[maxWidth];
}

export function alignItemsToCssValue(align: JpAlignItems): string {
  return ALIGN_TO_CSS_VALUE[align];
}

export function justifyContentToCssValue(justify: JpJustifyContent): string {
  return JUSTIFY_TO_CSS_VALUE[justify];
}

export function surfaceToneToCssVar(tone: JpSurfaceTone): string {
  return SURFACE_TONE_TO_CSS_VAR[tone];
}

export function borderToneToCssValue(border: JpBorderTone): string {
  return BORDER_TO_CSS_VALUE[border];
}

export function elevationToCssVar(elevation: JpElevationToken): string {
  return ELEVATION_TO_CSS_VAR[elevation];
}

export function textToneToCssVar(tone: JpTextTone): string {
  return TEXT_TONE_TO_CSS_VAR[tone];
}

export function textSizeToCssVar(size: JpTextSize): string {
  return TEXT_SIZE_TO_CSS_VAR[size];
}

export function headingSizeToCssVar(
  size: Exclude<JpHeadingSize, 'auto'>,
): string {
  return HEADING_SIZE_TO_CSS_VAR[size];
}

export function fontWeightToCssVar(weight: JpFontWeight): string {
  return FONT_WEIGHT_TO_CSS_VAR[weight];
}

export function gridMinColumnToCssVar(minColumn: JpGridMinColumn): string {
  return GRID_MIN_COLUMN_TO_CSS_VAR[minColumn];
}

export function resolveHeadingSize(
  requestedSize: JpHeadingSize,
  tag: JpHeadingTag,
): Exclude<JpHeadingSize, 'auto'> {
  if (requestedSize !== 'auto') {
    return requestedSize;
  }

  return tag === 'h1' || tag === 'h2' ? 'display' : 'title';
}
