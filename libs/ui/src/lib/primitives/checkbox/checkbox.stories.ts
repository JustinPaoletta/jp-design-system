import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent } from 'storybook/test';
import { JpCheckbox } from './checkbox';

const meta: Meta<JpCheckbox> = {
  title: 'Primitives/Controls/Checkbox',
  component: JpCheckbox,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    disabled: false,
    invalid: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-checkbox [disabled]="disabled" [invalid]="invalid">
        Subscribe to product updates
      </jp-checkbox>
    `,
  }),
};

export default meta;
type Story = StoryObj<JpCheckbox>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeTruthy();
    await expect(input?.checked).toBe(false);
    if (input) {
      await userEvent.click(input);
      await expect(input.checked).toBe(true);
      // Toggle back so the canvas matches the story args.
      await userEvent.click(input);
      await expect(input.checked).toBe(false);
    }
  },
};

export const Checked: Story = {
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  render: () => ({
    // Host prop must not be named `checked` — that collides with the CVA
    // component's internal `checked` signal when Storybook binds story props.
    props: { isOn: true },
    template: `
      <jp-checkbox [(ngModel)]="isOn">
        Subscribe to product updates
      </jp-checkbox>
    `,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input?.checked).toBe(true);
    await expect(
      canvasElement
        .querySelector('jp-checkbox')
        ?.classList.contains('jp-checkbox--checked'),
    ).toBe(true);
  },
};

export const Invalid: Story = {
  args: { invalid: true },
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
