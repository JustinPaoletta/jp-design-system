import {
  type Preview,
  componentWrapperDecorator,
} from '@storybook/angular';
import { create } from 'storybook/theming';

/** JP page fill — owned by the story, not the Storybook stage. */
const JP_PAGE_BG = '#0c111c'; // --jp-color-surface-sunken / neutral-1000
/** Default / Docs-fixed Storybook stage (mat around the page). */
const JP_STAGE_DARK = '#070b13'; // --jp-color-surface-canvas / neutral-1100
const JP_STAGE_LIGHT = '#f8f8f8';

const STAGE_STYLE_ID = 'jp-storybook-stage';
const GRID_STYLE_ID = 'jp-storybook-stage-grid';

const STAGE_OPTIONS: Record<string, string> = {
  dark: JP_STAGE_DARK,
  light: JP_STAGE_LIGHT,
};

/**
 * Docs UI theme. `appPreviewBg` is the Docs chrome mat; the story page
 * background is applied by `.jp-storybook-page` below.
 */
const jpDocsTheme = create({
  base: 'dark',
  appPreviewBg: JP_STAGE_DARK,
  appContentBg: JP_STAGE_DARK,
  appBg: JP_STAGE_DARK,
});

type BackgroundsGlobal = {
  value?: string;
  grid?: boolean;
};

function resolveStageValue(
  globals: { backgrounds?: string | BackgroundsGlobal },
): string {
  const data = globals.backgrounds;
  const name = typeof data === 'string' ? data : data?.value;
  if (!name) {
    return JP_STAGE_DARK;
  }
  return STAGE_OPTIONS[name] ?? JP_STAGE_DARK;
}

function upsertStyle(id: string, css: string | null): void {
  const existing = document.getElementById(id);
  if (!css) {
    existing?.remove();
    return;
  }
  const style =
    (existing as HTMLStyleElement | null) ?? document.createElement('style');
  style.id = id;
  style.textContent = css;
  if (!existing) {
    document.head.appendChild(style);
  }
}

/**
 * Docs: always fixed dark stage (no toolbar).
 * Canvas: stage follows the Canvas-only backgrounds global from manager.ts.
 */
function applyStage(
  viewMode: string | undefined,
  globals: { backgrounds?: string | BackgroundsGlobal },
): void {
  const isDocs = viewMode === 'docs';
  const stageValue = isDocs ? JP_STAGE_DARK : resolveStageValue(globals);
  const showGrid =
    !isDocs &&
    typeof globals.backgrounds === 'object' &&
    Boolean(globals.backgrounds?.grid);

  upsertStyle(
    STAGE_STYLE_ID,
    `
      .sb-show-main,
      .docs-story {
        background-color: ${stageValue} !important;
      }
    `,
  );

  if (!showGrid) {
    upsertStyle(GRID_STYLE_ID, null);
    return;
  }

  const cellSize = 100;
  const cellAmount = 10;
  const opacity = 0.8;
  const offset = 16;
  const gridSize = `${cellSize * cellAmount}px ${cellSize * cellAmount}px`;
  upsertStyle(
    GRID_STYLE_ID,
    `
      .sb-show-main {
        background-size: ${gridSize}, ${gridSize}, ${cellSize}px ${cellSize}px, ${cellSize}px ${cellSize}px !important;
        background-position: ${offset}px ${offset}px, ${offset}px ${offset}px, ${offset}px ${offset}px, ${offset}px ${offset}px !important;
        background-blend-mode: difference !important;
        background-image:
          linear-gradient(rgba(130, 130, 130, ${opacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(130, 130, 130, ${opacity}) 1px, transparent 1px),
          linear-gradient(rgba(130, 130, 130, ${opacity / 2}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(130, 130, 130, ${opacity / 2}) 1px, transparent 1px) !important;
      }
    `,
  );
}

const preview: Preview = {
  globalTypes: {
    accent: {
      name: 'Accent',
      defaultValue: 'neon',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'neon', title: 'Neon' },
          { value: 'cobalt', title: 'Cobalt' },
        ],
      },
    },
    density: {
      name: 'Density',
      defaultValue: 'default',
      toolbar: {
        icon: 'sidebar',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'compact', title: 'Compact' },
        ],
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'dark' },
  },
  decorators: [
    // Story owns its page surface; stage behind it is independent.
    componentWrapperDecorator(
      (story) => `
        <div
          class="jp-storybook-page"
          style="
            box-sizing: border-box;
            display: block;
            width: 100%;
            min-height: 100%;
            background: var(--jp-color-surface-sunken, ${JP_PAGE_BG});
            color: var(--jp-color-text-primary);
            font-family: var(--jp-font-family-base);
          "
        >${story}</div>
      `,
    ),
    (storyFn, context) => {
      const accent = context.globals['accent'] as string | undefined;
      const density = context.globals['density'] as string | undefined;
      const root = document.documentElement;
      const body = document.body;

      root.setAttribute(
        'data-jp-accent',
        accent === 'cobalt' ? 'cobalt' : 'neon',
      );
      root.style.colorScheme = 'dark';

      if (density === 'compact') {
        root.setAttribute('data-jp-density', 'compact');
      } else {
        root.removeAttribute('data-jp-density');
      }

      if (body) {
        body.style.margin = '0';
        body.style.minHeight = '100vh';
        body.style.padding = 'var(--jp-space-md)';
        body.style.color = 'var(--jp-color-text-primary)';
        body.style.fontFamily = 'var(--jp-font-family-base)';
        body.style.boxSizing = 'border-box';
      }

      applyStage(
        context.viewMode,
        context.globals as { backgrounds?: string | BackgroundsGlobal },
      );

      return storyFn();
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
    docs: {
      theme: jpDocsTheme,
      toc: true,
    },
  },
  tags: ['autodocs'],
};

export default preview;
