import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent } from 'storybook/test';
import { JpSwitch } from './switch';

const meta: Meta<JpSwitch> = {
  title: 'Primitives/Controls/Switch',
  component: JpSwitch,
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
      <jp-switch [disabled]="disabled" [invalid]="invalid">
        Compact density
      </jp-switch>
    `,
  }),
};

export default meta;
type Story = StoryObj<JpSwitch>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector('[role="switch"]');
    await expect(control).toBeTruthy();
    await expect(control?.getAttribute('aria-checked')).toBe('false');
    if (control) {
      await userEvent.click(control);
      await expect(control.getAttribute('aria-checked')).toBe('true');
      // Toggle back so the canvas matches the story args.
      await userEvent.click(control);
      await expect(control.getAttribute('aria-checked')).toBe('false');
    }
  },
};

export const On: Story = {
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  render: () => ({
    // Host prop must not be named `checked` — that collides with the CVA
    // component's internal `checked` signal when Storybook binds story props.
    props: { isOn: true },
    template: `
      <jp-switch [(ngModel)]="isOn">
        Compact density
      </jp-switch>
    `,
  }),
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector('[role="switch"]');
    await expect(control?.getAttribute('aria-checked')).toBe('true');
    await expect(
      canvasElement
        .querySelector('jp-switch')
        ?.classList.contains('jp-switch--checked'),
    ).toBe(true);
  },
};

export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector('[role="switch"]');
    await expect(control?.getAttribute('aria-invalid')).toBe('true');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector(
      '[role="switch"]',
    ) as HTMLButtonElement | null;
    await expect(control?.disabled).toBe(true);
  },
};
