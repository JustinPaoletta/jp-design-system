import type { Meta, StoryObj } from '@storybook/angular';
import { Ui } from './ui';
import { expect } from 'storybook/test';

const meta: Meta<Ui> = {
  component: Ui,
  title: 'Foundation/Token Demo',
};
export default meta;

type Story = StoryObj<Ui>;

function applyTheme({
  accent,
  density,
}: {
  accent?: 'neon' | 'cobalt';
  density?: 'default' | 'compact';
}) {
  const root = document.documentElement;

  if (accent) {
    root.setAttribute('data-jp-accent', accent);
  } else {
    root.removeAttribute('data-jp-accent');
  }

  if (!density || density === 'default') {
    root.removeAttribute('data-jp-density');
    return;
  }

  root.setAttribute('data-jp-density', density);
}

export const DefaultNeon: Story = {
  args: {},
  play: async ({ canvas }) => {
    applyTheme({ accent: 'neon', density: 'default' });
    await expect(canvas.getByText(/token demo surface/gi)).toBeTruthy();
    await expect(
      canvas.getByRole('button', { name: /primary action/gi }),
    ).toBeTruthy();
  },
};

export const CobaltAccent: Story = {
  args: {},
  play: async ({ canvas }) => {
    applyTheme({ accent: 'cobalt', density: 'default' });
    await expect(
      canvas.getByText(/accent and density are controlled/gi),
    ).toBeTruthy();
  },
};

export const CompactDensity: Story = {
  args: {},
  play: async ({ canvas }) => {
    applyTheme({ accent: 'neon', density: 'compact' });
    await expect(canvas.getByText(/active/gi)).toBeTruthy();
  },
};
