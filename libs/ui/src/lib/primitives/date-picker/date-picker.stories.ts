import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpDialog } from '../dialog/dialog';
import { JpDatePicker } from './date-picker';
const meta: Meta<JpDatePicker> = {
  title: 'Primitives/Controls/Date Picker',
  decorators: [
    moduleMetadata({ imports: [FormsModule, JpDialog] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 14rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpDatePicker,
  render: (args) => ({
    props: { ...args, selectedDate: '2024-10-30' },
    template: `<jp-date-picker [label]="label" [hint]="hint" [min]="min" [max]="max" [step]="step" [error]="error" [disabled]="disabled" [readonly]="readonly" [size]="size" [locale]="locale" [weekStartsOn]="weekStartsOn" [(ngModel)]="selectedDate" />`,
  }),
  parameters: { layout: 'padded' },
  args: {
    label: 'Game date',
    hint: 'Enter YYYY-MM-DD or choose a date.',
    min: '2024-10-01',
    max: '2024-10-31',
    error: '',
    disabled: false,
    readonly: false,
    size: 'md',
    locale: 'en-US',
    weekStartsOn: 0,
  },
};
export default meta;
type Story = StoryObj<JpDatePicker>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Game date'),
    ).toHaveAttribute('type', 'text');
  },
};
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('combobox')).toBeDisabled();
    await expect(
      c.getByRole('button', { name: 'Choose Game date' }),
    ).toBeDisabled();
  },
};
export const Readonly: Story = {
  args: { readonly: true },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('combobox')).toHaveAttribute('readonly');
    await expect(
      c.getByRole('button', { name: 'Choose Game date' }),
    ).toBeDisabled();
  },
};
export const Invalid: Story = { args: { error: 'Choose a valid date.' } };
export const OpenCalendar: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Choose Game date' }));
    await expect(
      c.getByRole('dialog', { name: 'Game date calendar' }),
    ).toBeVisible();
    await expect(
      c.getByRole('button', { name: 'Wednesday, October 30, 2024' }),
    ).toHaveFocus();
  },
};
export const KeyboardSelection: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      field = c.getByRole('combobox', { name: 'Game date' });
    await userEvent.click(field);
    await userEvent.keyboard('{ArrowDown}{ArrowLeft}{Enter}');
    await expect(field).toHaveValue('2024-10-29');
    await expect(field).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Escape}');
    await expect(field).toHaveValue('2024-10-29');
    await expect(field).toHaveFocus();
  },
};
export const ConstrainedDates: Story = {
  args: {
    min: '2024-10-01',
    max: '2024-10-31',
    step: 2,
    hint: 'Choose an available game day in October.',
  },
  render: (args) => ({
    props: { ...args, selectedDate: '2024-10-07' },
    template: `<jp-date-picker [label]="label" [hint]="hint" [min]="min" [max]="max" [step]="step" [(ngModel)]="selectedDate" />`,
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Choose Game date' }));
    await expect(
      c.getByRole('button', { name: 'Tuesday, October 8, 2024' }),
    ).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(
      c.getByRole('button', { name: 'Tuesday, October 8, 2024' }),
    );
    await expect(c.getByRole('combobox')).toHaveValue('2024-10-07');
    await expect(c.getByRole('dialog')).toBeVisible();
  },
};
export const NarrowCalendar: Story = {
  args: { locale: 'fr-FR', weekStartsOn: 1 },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Choose Game date' }));
    await expect(c.getByRole('dialog')).toBeVisible();
    await expect(c.getByRole('grid')).toHaveAccessibleName('octobre 2024');
  },
};
export const InsideDialog: Story = {
  render: (args) => ({
    props: { ...args, selectedDate: '2024-10-30', visible: true },
    template: `<jp-dialog title="Schedule a Falcons game" [open]="visible" (openChange)="visible = $event"><div style="height: 7rem; padding: 4px; overflow: hidden;"><jp-date-picker label="Game date" [(ngModel)]="selectedDate" /></div></jp-dialog>`,
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      await c.findByRole('button', { name: 'Choose Game date' }),
    );
    await expect(
      c.getByRole('dialog', { name: 'Game date calendar' }),
    ).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(
      c.getByRole('dialog', { name: 'Schedule a Falcons game' }),
    ).toBeVisible();
    await expect(
      c.getByRole('button', { name: 'Choose Game date' }),
    ).toHaveFocus();
    await userEvent.click(c.getByRole('button', { name: 'Choose Game date' }));
  },
};
