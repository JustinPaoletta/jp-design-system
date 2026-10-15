// Storybook's manager esbuild does not resolve Nx workspace path aliases.
// eslint-disable-next-line @nx/enforce-module-boundaries -- Consume the canonical public generated token artifact in tooling config.
import tokens from '../../tokens/src/generated/tokens.json';
import { create } from 'storybook/theming';
import { createElement, Fragment, memo, useCallback } from 'react';
import { CircleIcon, GridIcon, PhotoIcon } from '@storybook/icons';
import { Select, ToggleButton } from 'storybook/internal/components';
import { addons, types, useGlobals } from 'storybook/manager-api';

/**
 * Canvas-only stage toolbar. Stock Backgrounds also mounts on Docs; we disable
 * that feature in main.ts and register this story-only replacement instead.
 */
const ADDON_ID = 'jp/story-stage';
const PARAM_KEY = 'backgrounds';

const STAGE_OPTIONS: Record<string, { name: string; value: string }> = {
  dark: {
    name: 'Dark stage',
    value: tokens.semantic.base.color.surface.canvas,
  },
  light: { name: 'Light stage', value: tokens.primitive.color.neutral[50] },
};

type BackgroundsGlobal = {
  value?: string;
  grid?: boolean;
};

const StageTool = memo(function StageTool() {
  const [globals, updateGlobals] = useGlobals();
  const data = (globals[PARAM_KEY] || {}) as BackgroundsGlobal;
  const backgroundName = data.value;
  const isGrid = Boolean(data.grid);

  const update = useCallback(
    (input: BackgroundsGlobal | undefined) => {
      updateGlobals({ [PARAM_KEY]: input });
    },
    [updateGlobals],
  );

  const options = Object.entries(STAGE_OPTIONS).map(([key, stage]) => ({
    value: key,
    title: stage.name,
    icon: createElement(CircleIcon, { color: stage.value }),
  }));

  return createElement(
    Fragment,
    null,
    createElement(
      ToggleButton,
      {
        padding: 'small',
        variant: 'ghost',
        key: 'grid',
        pressed: isGrid,
        ariaLabel: 'Grid visibility',
        tooltip: 'Toggle grid visibility',
        onClick: () => update({ value: backgroundName, grid: !isGrid }),
      },
      createElement(GridIcon, null),
    ),
    createElement(Select, {
      resetLabel: 'Reset background',
      onReset: () => update(undefined),
      key: 'background',
      icon: createElement(PhotoIcon, null),
      ariaLabel: 'Preview background',
      tooltip: 'Change background',
      defaultOptions: backgroundName,
      options,
      onSelect: (selected: unknown) =>
        update({
          value: selected == null ? undefined : String(selected),
          grid: isGrid,
        }),
    }),
  );
});

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Stage',
    type: types.TOOL,
    // Docs sidebar entries stay on a fixed stage — no toggle there.
    match: ({ viewMode, tabId }) => viewMode === 'story' && !tabId,
    render: () => createElement(StageTool),
  });
});

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'JP Design System',
    colorPrimary: tokens.semantic.accent.gold.color.accent.solid,
    colorSecondary: tokens.semantic.accent.gold.color.accent.muted,
    appBg: tokens.semantic.base.color.surface.canvas,
    appContentBg: tokens.semantic.base.color.surface.sunken,
    appBorderColor: tokens.semantic.base.color.border.default,
    appBorderRadius: 6,
    textColor: tokens.semantic.base.color.text.primary,
    textMutedColor: tokens.semantic.base.color.text.muted,
    barBg: tokens.semantic.base.color.surface.sunken,
    barTextColor: tokens.semantic.base.color.text.secondary,
    inputBg: tokens.semantic.base.color.surface.sunken,
    inputBorder: tokens.semantic.base.color.border.default,
    inputTextColor: tokens.semantic.base.color.text.primary,
    inputBorderRadius: 4,
  }),
});
