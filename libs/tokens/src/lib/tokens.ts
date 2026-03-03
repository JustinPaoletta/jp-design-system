export const JP_ACCENT_ATTRIBUTE = 'data-jp-accent';
export const JP_DENSITY_ATTRIBUTE = 'data-jp-density';

export const JP_ACCENT_FAMILIES = ['neon', 'cobalt'] as const;
export type JpAccentFamily = (typeof JP_ACCENT_FAMILIES)[number];

export const JP_DENSITY_MODES = ['default', 'compact'] as const;
export type JpDensityMode = (typeof JP_DENSITY_MODES)[number];

export const JP_DEFAULT_ACCENT: JpAccentFamily = 'neon';
export const JP_DEFAULT_DENSITY: JpDensityMode = 'default';

export const JP_GENERATED_TOKEN_FILES = [
  'tokens.css',
  'tokens.compact.css',
  'tokens.json',
] as const;

export function getAccentSelector(accent: JpAccentFamily): string {
  if (accent === 'neon') {
    return ':root, [data-jp-accent="neon"]';
  }

  return `[data-jp-accent="${accent}"]`;
}

export function getDensitySelector(mode: JpDensityMode): string {
  if (mode === 'default') {
    return ':root';
  }

  return `[data-jp-density="${mode}"]`;
}

export function isAccentFamily(value: string): value is JpAccentFamily {
  return (JP_ACCENT_FAMILIES as readonly string[]).includes(value);
}

export function isDensityMode(value: string): value is JpDensityMode {
  return (JP_DENSITY_MODES as readonly string[]).includes(value);
}
