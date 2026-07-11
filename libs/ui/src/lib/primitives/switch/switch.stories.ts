import type { Meta, StoryObj } from '@storybook/angular';
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
    }
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
