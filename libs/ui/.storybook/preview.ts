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
        body.style.backgroundColor = 'var(--jp-color-surface-sunken)';
        body.style.color = 'var(--jp-color-text-primary)';
        body.style.fontFamily = 'var(--jp-font-family-base)';
        body.style.boxSizing = 'border-box';
      }

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
      test: 'todo',
    },
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
};

export default preview;
