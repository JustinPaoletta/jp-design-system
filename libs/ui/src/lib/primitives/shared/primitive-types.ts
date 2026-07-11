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

export const JP_GRID_COLUMNS = [1, 2, 3, 4, 6] as const;

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
  'emphasis',
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

export const JP_CONTROL_SIZES = ['sm', 'md', 'lg'] as const;

export type JpControlSize = (typeof JP_CONTROL_SIZES)[number];

export const JP_BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'ghost',
  'destructive',
] as const;

export type JpButtonVariant = (typeof JP_BUTTON_VARIANTS)[number];

export const JP_BUTTON_TYPES = ['button', 'submit', 'reset'] as const;

export type JpButtonType = (typeof JP_BUTTON_TYPES)[number];

export const JP_INPUT_TYPES = [
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
] as const;

export type JpInputType = (typeof JP_INPUT_TYPES)[number];

export const JP_BADGE_TONES = [
  'neutral',
  'accent',
  'success',
  'warning',
  'error',
  'info',
] as const;

export type JpBadgeTone = (typeof JP_BADGE_TONES)[number];

export const JP_BADGE_SIZES = ['sm', 'md'] as const;

export type JpBadgeSize = (typeof JP_BADGE_SIZES)[number];

export const JP_TABLE_ALIGNS = ['start', 'center', 'end'] as const;

export type JpTableAlign = (typeof JP_TABLE_ALIGNS)[number];

export type JpTableCellValue = string | number | null | undefined;

export interface JpTableColumn {
  key: string;
  header: string;
  align?: JpTableAlign;
}

export const JP_TOOLTIP_PLACEMENTS = [
  'top',
  'bottom',
  'left',
  'right',
] as const;

export type JpTooltipPlacement = (typeof JP_TOOLTIP_PLACEMENTS)[number];

export const JP_TOAST_TONES = [
  'neutral',
  'success',
  'warning',
  'error',
  'info',
] as const;

export type JpToastTone = (typeof JP_TOAST_TONES)[number];

export interface JpToastOptions {
  message: string;
  tone?: JpToastTone;
  durationMs?: number;
}

export interface JpToastItem {
  id: number;
  message: string;
  tone: JpToastTone;
  durationMs: number;
}
