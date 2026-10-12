import type { Meta, StoryObj } from '@storybook/angular';
import { JpStepper } from './stepper';
const meta: Meta<JpStepper> = {
  title: 'Primitives/Navigation/Stepper',
  component: JpStepper,
  parameters: { layout: 'padded' },
  args: {
    label: 'Club registration',
    currentId: 'details',
    steps: [
      { id: 'intro', label: 'Clubhouse', state: 'complete' },
      {
        id: 'details',
        label: 'Details',
        description: 'Club name and coach email',
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
      { id: 'intro', label: 'Clubhouse', state: 'complete' },
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
