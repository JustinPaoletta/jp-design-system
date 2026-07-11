import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JP_BADGE_SIZES, JP_BADGE_TONES } from '../shared/primitive-types';
import { JpBadge } from './badge';

const meta: Meta<JpBadge> = {
  title: 'Primitives/Data Display/Badge',
  component: JpBadge,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: JP_BADGE_TONES,
    },
    size: {
      control: 'select',
      options: JP_BADGE_SIZES,
    },
  },
  args: {
    tone: 'neutral',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-badge [tone]="tone" [size]="size">Badge</jp-badge>
    `,
  }),
};

export default meta;
type Story = StoryObj<JpBadge>;

export const Neutral: Story = {
  args: { tone: 'neutral' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-badge');
    await expect(host?.classList.contains('jp-badge--neutral')).toBe(true);
  },
};

export const Accent: Story = {
  args: { tone: 'accent' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-badge');
    await expect(host?.classList.contains('jp-badge--accent')).toBe(true);
  },
};

export const Success: Story = {
  args: { tone: 'success' },
};

export const Warning: Story = {
  args: { tone: 'warning' },
};

export const Error: Story = {
  args: { tone: 'error' },
};

export const Info: Story = {
  args: { tone: 'info' },
};

export const Small: Story = {
  args: { tone: 'accent', size: 'sm' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-badge');
    await expect(host?.classList.contains('jp-badge--sm')).toBe(true);
  },
};

export const AllTones: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <jp-badge tone="neutral">Neutral</jp-badge>
        <jp-badge tone="accent">Accent</jp-badge>
        <jp-badge tone="success">Success</jp-badge>
        <jp-badge tone="warning">Warning</jp-badge>
        <jp-badge tone="error">Error</jp-badge>
        <jp-badge tone="info">Info</jp-badge>
      </div>
    `,
  }),
};
