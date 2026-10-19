import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_BADGE_SIZES,
  JP_BADGE_TONES,
  type JpBadgeSize,
  type JpBadgeTone,
} from '../shared/primitive-types';
import { JpBadge } from './badge';

type BadgeStoryArgs = {
  tone: JpBadgeTone;
  size: JpBadgeSize;
  label: string;
};

const meta: Meta<BadgeStoryArgs> = {
  title: 'Primitives/Data Display/Badge',
  component: JpBadge,
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
    label: {
      control: 'text',
    },
  },
  args: {
    tone: 'neutral',
    size: 'md',
    label: 'Rostered',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-badge [tone]="tone" [size]="size">{{ label }}</jp-badge>
    `,
  }),
};

export default meta;
type Story = StoryObj<BadgeStoryArgs>;

export const Neutral: Story = {
  args: { tone: 'neutral', label: 'Bench' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-badge');
    await expect(host?.classList.contains('jp-badge--neutral')).toBe(true);
  },
};

export const Accent: Story = {
  args: { tone: 'accent', label: 'Starter' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-badge');
    await expect(host?.classList.contains('jp-badge--accent')).toBe(true);
  },
};

export const Success: Story = {
  args: { tone: 'success', label: 'Available' },
};

export const Warning: Story = {
  args: { tone: 'warning', label: 'Day to day' },
};

export const Error: Story = {
  args: { tone: 'error', label: 'Injured' },
};

export const Info: Story = {
  args: { tone: 'info', label: 'Away game' },
};

export const Small: Story = {
  args: { tone: 'accent', size: 'sm', label: 'Starter' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-badge');
    await expect(host?.classList.contains('jp-badge--sm')).toBe(true);
  },
};

export const AllTones: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: var(--jp-space-sm);">
        <jp-badge tone="neutral">Bench</jp-badge>
        <jp-badge tone="accent">Starter</jp-badge>
        <jp-badge tone="success">Available</jp-badge>
        <jp-badge tone="warning">Day to day</jp-badge>
        <jp-badge tone="error">Injured</jp-badge>
        <jp-badge tone="info">Away game</jp-badge>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: var(--jp-space-sm);">
        <jp-badge tone="accent" size="sm">Starter</jp-badge>
        <jp-badge tone="accent" size="md">Medium</jp-badge>
      </div>
    `,
  }),
};
