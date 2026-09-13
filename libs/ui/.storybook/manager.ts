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
  dark: { name: 'Dark stage', value: '#070b13' },
  light: { name: 'Light stage', value: '#f8f8f8' },
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
      onSelect: (selected: string | number | undefined) =>
        update({
          value: selected === undefined ? undefined : String(selected),
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
