import { componentWrapperDecorator } from '@storybook/angular';
import { Component, input, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpInlineEdit } from './inline-edit';
@Component({
  selector: 'jp-inline-edit-demo',
  imports: [JpInlineEdit],
  template:
    '<jp-inline-edit [label]="label()" [value]="value()" (valueChange)="value.set($event)" [save]="persist" [disabled]="disabled()" required />',
})
class InlineEditDemo {
  readonly label = input('Club name');
  readonly disabled = input(false);
  readonly fail = input(false);
  readonly value = signal('Los Angeles Dodgers');
  readonly persist = async () => {
    if (this.fail()) throw new Error('Denied');
  };
}
const render = (args: Record<string, unknown>, fail = false) => ({
  props: { ...args, fail },
  template:
    '<jp-inline-edit-demo [label]="label" [disabled]="disabled" [fail]="fail" />',
});
const meta: Meta<JpInlineEdit> = {
  title: 'Primitives/Controls/Inline Edit',
  component: JpInlineEdit,
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 28rem; width: 100%;">${story}</div>`,
    ),
    moduleMetadata({ imports: [InlineEditDemo] }),
  ],
  parameters: { layout: 'padded' },
  args: { label: 'Club name', disabled: false },
  render: (args) => render(args),
};
export default meta;
type Story = StoryObj<JpInlineEdit>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Edit: Club name' }));
    const input = c.getByRole('textbox', { name: 'Club name' });
    await expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, 'Los Angeles Dodgers Active roster');
    await userEvent.click(c.getByRole('button', { name: /^Save$/ }));
    await expect(
      c.getByRole('button', { name: 'Edit: Club name' }),
    ).toHaveFocus();
    await expect(canvasElement).toHaveTextContent(
      'Los Angeles Dodgers Active roster',
    );
  },
};
export const Failed: Story = {
  render: (args) => render(args, true),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Edit: Club name' }));
    await userEvent.click(c.getByRole('button', { name: /^Save$/ }));
    await expect(c.getByRole('alert')).toHaveTextContent('Could not save');
    await expect(c.getByRole('textbox', { name: 'Club name' })).toHaveFocus();
  },
};
export const Disabled: Story = { args: { disabled: true } };
