import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import {
  JP_BUTTON_TYPES,
  JP_BUTTON_VARIANTS,
  JP_CONTROL_SIZES,
} from '../shared/primitive-types';
import { JpButton } from './button';

const meta: Meta<JpButton> = {
  title: 'Primitives/Controls/Button',
  component: JpButton,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: JP_BUTTON_VARIANTS,
    },
    size: {
      control: 'select',
      options: JP_CONTROL_SIZES,
    },
    type: {
      control: 'select',
      options: JP_BUTTON_TYPES,
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-button
        [variant]="variant"
        [size]="size"
        [type]="type"
        [disabled]="disabled"
      >
        Button
      </jp-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<JpButton>;

export const Primary: Story = {
  args: { variant: 'primary' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-button');
    await expect(host?.classList.contains('jp-button--primary')).toBe(true);
    const button = canvasElement.querySelector('button');
    await expect(button).toBeTruthy();
    await expect(button?.disabled).toBe(false);
  },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-button');
    await expect(host?.classList.contains('jp-button--secondary')).toBe(true);
  },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-button');
    await expect(host?.classList.contains('jp-button--ghost')).toBe(true);
  },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-button');
    await expect(host?.classList.contains('jp-button--destructive')).toBe(true);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    await expect(button?.disabled).toBe(true);
  },
};
