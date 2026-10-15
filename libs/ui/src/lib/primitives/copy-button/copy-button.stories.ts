import type { Meta, StoryObj } from '@storybook/angular';
import { JpCopyButton } from './copy-button';
const meta: Meta<JpCopyButton> = {
  title: 'Primitives/Controls/Copy Button',
  component: JpCopyButton,
  parameters: { layout: 'padded' },
  args: { text: 'Falcons 5, Bears 3', label: 'Copy score' },
};
export default meta;
type Story = StoryObj<JpCopyButton>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Localized: Story = {
  args: {
    label: 'Kopieren',
    successLabel: 'Kopiert',
    failureLabel: 'Kopieren nicht möglich. Bitte den Text manuell kopieren.',
  },
};
