import type { Meta, StoryObj } from '@storybook/angular';
import { JpStepper } from './stepper';
const meta: Meta<JpStepper> = {
  title: 'Primitives/Navigation/Stepper',
  component: JpStepper,
  parameters: { layout: 'padded' },
  args: {
    label: 'Project setup',
    currentId: 'details',
    steps: [
      { id: 'intro', label: 'Workspace', state: 'complete' },
      {
        id: 'details',
        label: 'Details',
        description: 'Name and notification email',
      },
      { id: 'review', label: 'Review' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpStepper>;
export const Default: Story = {};
export const Navigable: Story = { args: { navigable: true } };
export const Error: Story = {
  args: {
    steps: [
      { id: 'intro', label: 'Workspace', state: 'complete' },
      {
        id: 'details',
        label: 'Details',
        state: 'error',
        description: 'Check your email',
      },
      { id: 'review', label: 'Review', disabled: true },
    ],
  },
};
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
