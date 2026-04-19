export const JP_SPACE_TOKENS = [
  'none',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
] as const;

export type JpSpaceToken = (typeof JP_SPACE_TOKENS)[number];

export const JP_RADIUS_TOKENS = [
  'none',
  'sm',
  'md',
  'lg',
  'xl',
  'full',
] as const;

export type JpRadiusToken = (typeof JP_RADIUS_TOKENS)[number];

export const JP_LAYOUT_TAGS = [
  'div',
  'section',
  'article',
  'aside',
  'main',
  'header',
  'footer',
  'nav',
] as const;

export type JpLayoutTag = (typeof JP_LAYOUT_TAGS)[number];

export const JP_BOX_MAX_WIDTHS = ['none', 'narrow', 'wide'] as const;

export type JpBoxMaxWidth = (typeof JP_BOX_MAX_WIDTHS)[number];

export const JP_ALIGN_ITEMS = ['start', 'center', 'end', 'stretch'] as const;

export type JpAlignItems = (typeof JP_ALIGN_ITEMS)[number];

export const JP_JUSTIFY_CONTENT = [
  'start',
  'center',
  'end',
  'between',
] as const;

export type JpJustifyContent = (typeof JP_JUSTIFY_CONTENT)[number];

export const JP_GRID_COLUMNS = [1, 2, 3, 4, 6, 12] as const;

export type JpGridColumns = (typeof JP_GRID_COLUMNS)[number];

export const JP_GRID_MODES = ['fixed', 'auto-fit'] as const;

export type JpGridMode = (typeof JP_GRID_MODES)[number];

export const JP_GRID_MIN_COLUMNS = ['sm', 'md', 'lg'] as const;

export type JpGridMinColumn = (typeof JP_GRID_MIN_COLUMNS)[number];

export const JP_SURFACE_TONES = [
  'canvas',
  'sunken',
  'subtle',
  'raised',
  'overlay',
] as const;

export type JpSurfaceTone = (typeof JP_SURFACE_TONES)[number];

export const JP_BORDER_TONES = ['none', 'subtle', 'default', 'strong'] as const;

export type JpBorderTone = (typeof JP_BORDER_TONES)[number];

export const JP_ELEVATION_TOKENS = [
  'none',
  'raised',
  'floating',
  'overlay',
] as const;

export type JpElevationToken = (typeof JP_ELEVATION_TOKENS)[number];

export const JP_TEXT_TAGS = [
  'p',
  'span',
  'label',
  'small',
  'strong',
  'em',
] as const;

export type JpTextTag = (typeof JP_TEXT_TAGS)[number];

export const JP_TEXT_SIZES = ['caption', 'body', 'body-lg'] as const;

export type JpTextSize = (typeof JP_TEXT_SIZES)[number];

export const JP_TEXT_TONES = [
  'primary',
  'secondary',
  'muted',
  'disabled',
  'inverse',
] as const;

export type JpTextTone = (typeof JP_TEXT_TONES)[number];

export const JP_FONT_WEIGHTS = [
  'regular',
  'medium',
  'semibold',
  'bold',
] as const;

export type JpFontWeight = (typeof JP_FONT_WEIGHTS)[number];

export const JP_HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export type JpHeadingTag = (typeof JP_HEADING_TAGS)[number];

export const JP_HEADING_SIZES = ['auto', 'title', 'display'] as const;

export type JpHeadingSize = (typeof JP_HEADING_SIZES)[number];
