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

export const Readonly: Story = {
  args: {
    readonly: true,
    hint: 'This value cannot be edited.',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input?.readOnly).toBe(true);
  },
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <jp-input label="Small" size="sm" placeholder="Small" [hint]="''" />
        <jp-input label="Medium" size="md" placeholder="Medium" [hint]="''" />
        <jp-input label="Large" size="lg" placeholder="Large" [hint]="''" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('jp-input');
    await expect(inputs.length).toBe(3);
    await expect(inputs[0].classList.contains('jp-input--sm')).toBe(true);
    await expect(inputs[2].classList.contains('jp-input--lg')).toBe(true);
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
