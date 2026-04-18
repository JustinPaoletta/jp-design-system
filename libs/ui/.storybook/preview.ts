import type { Preview } from '@storybook/angular';

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
  decorators: [
    (storyFn, context) => {
      const accent = context.globals['accent'] as string | undefined;
      const density = context.globals['density'] as string | undefined;
      const root = document.documentElement;

      root.setAttribute(
        'data-jp-accent',
        accent === 'cobalt' ? 'cobalt' : 'neon',
      );

      if (density === 'compact') {
        root.setAttribute('data-jp-density', 'compact');
      } else {
        root.removeAttribute('data-jp-density');
      }

      return storyFn();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
