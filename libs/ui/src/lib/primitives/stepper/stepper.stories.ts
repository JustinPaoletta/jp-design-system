import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
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
        description: 'Club name and manager email',
      },
      { id: 'review', label: 'Review' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<jp-stepper [label]="label" [currentId]="currentId" [steps]="steps" [navigable]="navigable" (stepSelected)="currentId=$event" />`,
  }),
};
export default meta;
type Story = StoryObj<JpStepper>;
export const Default: Story = {};
export const Navigable: Story = {
  args: { navigable: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Review' }));
    await expect(
      canvas.getByRole('button', { name: 'Review' }),
    ).toHaveAttribute('aria-current', 'step');
    await userEvent.click(canvas.getByRole('button', { name: 'Details' }));
    await expect(
      canvas.getByRole('button', { name: 'Details' }),
    ).toHaveAttribute('aria-current', 'step');
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
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
export const NarrowPanel: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-inline-size: 20rem">${story}</div>`,
    ),
  ],
};
