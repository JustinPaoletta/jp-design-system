import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent } from 'storybook/test';
import { JpCombobox } from './combobox';
const meta: Meta<JpCombobox> = {
  title: 'Primitives/Controls/Combobox',
  component: JpCombobox,
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
    template: `<jp-combobox [label]="label" [hint]="hint" [error]="error" [options]="options" [disabled]="disabled" [(ngModel)]="selectedRole" />`,
  }),
};
export default meta;
type Story = StoryObj<JpCombobox>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  args: { error: 'Select a role before saving.' },
};
export const KeyboardSearch: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector(
      'input[type=text]',
    ) as HTMLInputElement;
    await userEvent.click(control);
    await userEvent.type(control, 'Edit');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(control.value).toBe('Editor');
    await expect(control.getAttribute('aria-expanded')).toBe('false');
  },
};
export const Loading: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-combobox [label]="label" [options]="options" loading />`,
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      canvasElement.querySelector('input[type=text]') as HTMLInputElement,
    );
  },
};
export const NoResults: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      canvasElement.querySelector('input[type=text]') as HTMLInputElement,
    );
    await userEvent.type(
      canvasElement.querySelector('input[type=text]') as HTMLInputElement,
      'missing',
    );
    await expect(
      canvasElement.querySelector('[role=status]')?.textContent,
    ).toContain('No results');
  },
};

export const ClippedContainer: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="height:8rem;overflow:hidden;padding:1rem;transform:translateZ(0);border:1px solid var(--jp-color-field-border)">
      <p style="color:var(--jp-color-foreground-muted)">The options escape this clipped container.</p>
      <jp-combobox [label]="label" [options]="options" />
    </div>`,
  }),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      canvasElement.querySelector('input[type=text]') as HTMLInputElement,
    );
    await expect(
      canvasElement
        .querySelector('.jp-combobox__popup')
        ?.getAttribute('popover'),
    ).toBe('manual');
  },
};
