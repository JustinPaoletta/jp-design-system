import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JP_CONTROL_SIZES } from '../shared/primitive-types';
import { JpSelect } from './select';

const meta: Meta<JpSelect> = {
  title: 'Primitives/Controls/Select',
  component: JpSelect,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: JP_CONTROL_SIZES,
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    label: 'Role',
    hint: 'Controls workspace permissions.',
    error: '',
    size: 'md',
    disabled: false,
    invalid: false,
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-select
        [label]="label"
        [hint]="hint"
        [error]="error"
        [size]="size"
        [disabled]="disabled"
        [invalid]="invalid"
        [options]="options"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<JpSelect>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector('select');
    await expect(select).toBeTruthy();
    await expect(select?.options.length).toBe(3);
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    error: 'Select a role.',
    hint: '',
  },
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector('select');
    await expect(select?.getAttribute('aria-invalid')).toBe('true');
  },
};
