import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpToggleButton } from './toggle-button';
const meta: Meta<JpToggleButton> = {
  title: 'Primitives/Controls/Toggle Button',
  component: JpToggleButton,
  args: { label: 'Favorite' },
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<JpToggleButton>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Favorite',
    });
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  },
};
export const Disabled: Story = { args: { disabled: true } };
