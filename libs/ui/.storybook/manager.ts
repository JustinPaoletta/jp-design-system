// Storybook's manager esbuild does not resolve Nx workspace path aliases.
// eslint-disable-next-line @nx/enforce-module-boundaries -- Consume the canonical public generated token artifact in tooling config.
import tokens from '../../tokens/src/generated/tokens.json';
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
