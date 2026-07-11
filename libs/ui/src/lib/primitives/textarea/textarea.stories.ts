import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JP_CONTROL_SIZES } from '../shared/primitive-types';
import { JpTextarea } from './textarea';

const meta: Meta<JpTextarea> = {
  title: 'Primitives/Controls/Textarea',
  component: JpTextarea,
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
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    label: 'Notes',
    hint: 'Optional context for reviewers.',
    error: '',
    rows: 4,
    size: 'md',
    disabled: false,
    readonly: false,
    invalid: false,
    placeholder: 'Add notes…',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-textarea
        [label]="label"
        [hint]="hint"
        [error]="error"
        [rows]="rows"
        [size]="size"
        [disabled]="disabled"
        [readonly]="readonly"
        [invalid]="invalid"
        [placeholder]="placeholder"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<JpTextarea>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    await expect(textarea).toBeTruthy();
    await expect(textarea?.rows).toBe(4);
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    error: 'Notes are required.',
    hint: '',
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    await expect(textarea?.getAttribute('aria-invalid')).toBe('true');
  },
};
