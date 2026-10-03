import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent } from 'storybook/test';
import { JpRadioGroup } from './radio-group';
const meta: Meta<JpRadioGroup> = {
  title: 'Primitives/Controls/Radio Group',
  component: JpRadioGroup,
  decorators: [moduleMetadata({ imports: [FormsModule] })],
  parameters: { layout: 'padded' },
  args: {
    label: 'Workspace role',
    hint: 'Choose access for this member.',
    options: [
      { value: 'viewer', label: 'Viewer' },
      { value: 'editor', label: 'Editor' },
      { value: 'admin', label: 'Admin', disabled: true },
    ],
    disabled: false,
    error: '',
  },
  render: (args) => ({
    props: { ...args, selectedRole: 'viewer' },
    template: `<jp-radio-group [label]="label" [hint]="hint" [error]="error" [options]="options" [disabled]="disabled" [(ngModel)]="selectedRole" />`,
  }),
};
export default meta;
type Story = StoryObj<JpRadioGroup>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: 'Select a role before saving.' },
};
export const KeyboardSelection: Story = {
  play: async ({ canvasElement }) => {
    const first = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(first);
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      (canvasElement.querySelectorAll('input')[1] as HTMLInputElement).checked,
    ).toBe(true);
  },
};
