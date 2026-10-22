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
  readonly label = input('Collection name');
  readonly disabled = input(false);
  readonly fail = input(false);
  readonly value = signal('The night Tampa Bay clinched');
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
  args: { label: 'Collection name', disabled: false },
  render: (args) => render(args),
};
export default meta;
type Story = StoryObj<JpInlineEdit>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole('button', { name: 'Edit: Collection name' }),
    );
    const input = c.getByRole('textbox', { name: 'Collection name' });
    await expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, 'Game 6 — a pennant to remember');
    await userEvent.click(c.getByRole('button', { name: /^Save$/ }));
    await expect(
      c.getByRole('button', { name: 'Edit: Collection name' }),
    ).toHaveFocus();
    await expect(canvasElement).toHaveTextContent(
      'Game 6 — a pennant to remember',
    );
  },
};
export const Failed: Story = {
  render: (args) => render(args, true),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole('button', { name: 'Edit: Collection name' }),
    );
    await userEvent.click(c.getByRole('button', { name: /^Save$/ }));
    await expect(c.getByRole('alert')).toHaveTextContent('Could not save');
    await expect(
      c.getByRole('textbox', { name: 'Collection name' }),
    ).toHaveFocus();
  },
};
export const Disabled: Story = { args: { disabled: true } };
