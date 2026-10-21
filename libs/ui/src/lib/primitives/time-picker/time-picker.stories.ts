import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpTimePicker } from './time-picker';
import { JpDialog } from '../dialog/dialog';

const meta: Meta<JpTimePicker> = {
  title: 'Primitives/Controls/Time Picker',
  decorators: [
    moduleMetadata({ imports: [FormsModule, JpDialog] }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 14rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpTimePicker,
  render: (args) => ({
    props: args,
    template: `<jp-time-picker [label]="label" [hint]="hint" [min]="min" [max]="max" [step]="step" [error]="error || ''" [disabled]="disabled" [readonly]="readonly" [ngModel]="'20:00'" />`,
  }),
  parameters: { layout: 'padded' },
  args: {
    label: 'First pitch',
    hint: 'Choose a 15-minute broadcast slot for Dodgers–Yankees.',
    min: '09:00',
    max: '22:00',
    step: 900,
  },
};
export default meta;
type Story = StoryObj<JpTimePicker>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('First pitch'),
    ).toHaveAttribute('type', 'text');
    await expect(
      within(canvasElement).getByRole('button', { name: 'Choose time' }),
    ).toHaveAttribute('aria-haspopup', 'dialog');
  },
};
export const OpenMenu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Choose time' }));
    await expect(
      canvas.getByRole('dialog', { name: 'First pitch' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('spinbutton', { name: 'Hour' }),
    ).toHaveFocus();
  },
};
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByLabelText('First pitch').focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    const minute = canvas.getByRole('spinbutton', { name: 'Minute' });
    minute.focus();
    await userEvent.keyboard('{ArrowUp}{Enter}');
    await expect(canvas.getByLabelText('First pitch')).toHaveValue('20:15');
    await expect(canvas.getByLabelText('First pitch')).toHaveFocus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}{Escape}');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(canvas.getByLabelText('First pitch')).toHaveValue('20:15');
  },
};
export const Seconds: Story = {
  args: {
    min: '19:00:00.125',
    max: '22:00',
    step: 0.25,
    hint: 'Keep the broadcast delay accurate to a quarter second.',
  },
  render: (args) => ({
    props: args,
    template: `<jp-time-picker [label]="label" [hint]="hint" [min]="min" [max]="max" [step]="step" [ngModel]="'20:08:30.125'" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Choose time' }));
    await expect(
      canvas.getByRole('spinbutton', { name: 'Second' }),
    ).toHaveValue('30.125');
  },
};
export const Narrow: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="width: 12rem; max-width: 100%;">${story}</div>`,
    ),
  ],
  play: OpenMenu.play,
};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = { args: { readonly: true } };
export const Invalid: Story = {
  args: { error: 'Choose a valid broadcast time.' },
};

export const InsideDialog: Story = {
  render: (args) => ({
    props: { ...args, dialogVisible: true },
    template: `<jp-dialog title="Broadcast schedule" [open]="dialogVisible" (openChange)="dialogVisible = $event"><div style="height: 7rem; padding: 4px; overflow: hidden;"><jp-time-picker label="First pitch" [min]="min" [max]="max" [step]="step" [ngModel]="'20:00'" /></div></jp-dialog>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Choose time' }),
    );
    await expect(
      canvas.getByRole('dialog', { name: 'First pitch' }),
    ).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(
      canvas.getByRole('dialog', { name: 'Broadcast schedule' }),
    ).toBeVisible();
    await expect(canvas.getByLabelText('First pitch')).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Choose time' }));
    await expect(
      canvas.getByRole('dialog', { name: 'First pitch' }),
    ).toBeVisible();
  },
};
