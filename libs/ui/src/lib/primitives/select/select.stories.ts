import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent, within } from 'storybook/test';
import { JP_CONTROL_SIZES } from '../shared/primitive-types';
import { JpDialog } from '../dialog/dialog';
import { JpSelect } from './select';

const meta: Meta<JpSelect> = {
  title: 'Primitives/Controls/Select',
  decorators: [
    moduleMetadata({ imports: [FormsModule, JpDialog] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 24rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpSelect,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'select', options: JP_CONTROL_SIZES },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    label: 'Archive role',
    hint: 'Controls access to club records.',
    error: '',
    size: 'md',
    disabled: false,
    invalid: false,
    placeholder: 'Choose a role',
    options: [
      { value: 'admin', label: 'Manager' },
      { value: 'editor', label: 'Scorekeeper' },
      { value: 'viewer', label: 'Fan' },
      { value: 'medical', label: 'Medical staff', disabled: true },
    ],
  },
  render: (args) => ({
    props: { ...args, selectedRole: args.invalid ? '' : 'editor' },
    template: `<jp-select [label]="label" [hint]="hint" [error]="error" [size]="size" [disabled]="disabled" [invalid]="invalid" [options]="options" [placeholder]="placeholder" [(ngModel)]="selectedRole" />`,
  }),
};
export default meta;
type Story = StoryObj<JpSelect>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const control = c.getByRole('combobox', { name: 'Archive role' });
    await expect(control).toHaveTextContent('Scorekeeper');
    await userEvent.click(control);
    await expect(
      c.getByRole('option', { name: 'Medical staff' }),
    ).toBeDisabled();
    await userEvent.keyboard('{Home}{Enter}');
    await expect(control).toHaveTextContent('Manager');
    await userEvent.click(control);
    await userEvent.keyboard('{End}{Escape}');
    await expect(control).toHaveTextContent('Manager');
    await expect(control).toHaveFocus();
    await userEvent.click(control);
    await userEvent.click(c.getByRole('option', { name: 'Scorekeeper' }));
  },
};
export const Invalid: Story = {
  args: { invalid: true, error: 'Select a club role.', hint: '' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox')).toHaveTextContent(
      'Choose a role',
    );
    await expect(within(canvasElement).getByRole('combobox')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox')).toBeDisabled();
  },
};
export const OpenMenu: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('combobox'));
    await expect(c.getByRole('listbox')).toBeVisible();
    await expect(
      c.getByRole('option', { name: 'Scorekeeper' }),
    ).toHaveAttribute('aria-selected', 'true');
  },
};
export const TimeZone: Story = {
  args: {
    label: 'Time zone',
    hint: 'Show club appointments in this time zone.',
    options: [
      { value: 'America/New_York', label: 'America/New_York' },
      { value: 'UTC', label: 'UTC' },
      { value: 'Europe/London', label: 'Europe/London' },
    ],
  },
  render: (args) => ({
    props: { ...args, selectedZone: 'America/New_York' },
    template: `<jp-select [label]="label" [hint]="hint" [options]="options" [(ngModel)]="selectedZone" />`,
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('combobox', { name: 'Time zone' }));
    await expect(
      c.getByRole('option', { name: 'America/New_York' }),
    ).toHaveAttribute('aria-selected', 'true');
  },
};
export const LongLabels: Story = {
  args: {
    options: [
      {
        value: 'editor',
        label: 'Scorekeeper for the Rays home and away games',
      },
      {
        value: 'admin',
        label: 'Manager for the Rays player development program',
      },
      {
        value: 'medical',
        label: 'Medical staff access is not available',
        disabled: true,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'));
    await expect(within(canvasElement).getByRole('listbox')).toBeVisible();
  },
};
export const InsideDialog: Story = {
  render: (args) => ({
    props: { ...args, selectedRole: 'editor', dialogVisible: true },
    template: `<jp-dialog title="Club access" [open]="dialogVisible" (openChange)="dialogVisible = $event"><div style="height: 7rem; padding: 4px; overflow: hidden;"><jp-select label="Archive role" [options]="options" [(ngModel)]="selectedRole" /></div></jp-dialog>`,
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const control = await c.findByRole('combobox');
    await userEvent.click(control);
    await expect(c.getByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(c.getByRole('dialog')).toBeVisible();
    await expect(control).toHaveFocus();
    await userEvent.click(control);
    await expect(c.getByRole('listbox')).toBeVisible();
  },
};
