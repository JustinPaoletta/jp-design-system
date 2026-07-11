import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { JP_CONTROL_SIZES, JP_INPUT_TYPES } from '../shared/primitive-types';
import { JpInput } from './input';

const meta: Meta<JpInput> = {
  title: 'Primitives/Controls/Input',
  component: JpInput,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    type: {
      control: 'select',
      options: JP_INPUT_TYPES,
    },
    size: {
      control: 'select',
      options: JP_CONTROL_SIZES,
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    label: 'Email',
    hint: 'We will never share your email.',
    error: '',
    type: 'email',
    size: 'md',
    disabled: false,
    readonly: false,
    invalid: false,
    placeholder: 'you@example.com',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-input
        [label]="label"
        [hint]="hint"
        [error]="error"
        [type]="type"
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
type Story = StoryObj<JpInput>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeTruthy();
    await expect(canvasElement.querySelector('label')?.textContent).toContain(
      'Email',
    );
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    error: 'Enter a valid email address.',
    hint: '',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input?.getAttribute('aria-invalid')).toBe('true');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input?.disabled).toBe(true);
  },
};

export const Typing: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeTruthy();
    if (input) {
      await userEvent.clear(input);
      await userEvent.type(input, 'a@b.co');
      await expect(input.value).toBe('a@b.co');
    }
  },
};
