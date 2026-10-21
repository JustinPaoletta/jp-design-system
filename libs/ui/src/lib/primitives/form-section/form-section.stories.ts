import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpCheckbox } from '../checkbox/checkbox';
import { JpCard } from '../card/card';
import { JpFormSection } from './form-section';

const meta: Meta<JpFormSection> = {
  title: 'Primitives/Controls/Form Section',
  component: JpFormSection,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="max-inline-size:32rem;margin:var(--jp-space-lg) auto">${story}</div>`,
    ),
    moduleMetadata({ imports: [JpCheckbox, JpCard] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    legend: 'Club messages',
    hint: 'Choose which Dodgers updates you receive by email.',
    error: '',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<jp-card><jp-form-section [legend]="legend" [hint]="hint" [error]="error" [disabled]="disabled">
      <jp-checkbox [disabled]="disabled" hint="Starting times and field changes.">Game reminders</jp-checkbox>
      <jp-checkbox [disabled]="disabled" hint="Player availability and starting positions.">Lineup updates</jp-checkbox>
      <jp-checkbox [disabled]="disabled" hint="Scores and notes after the final inning.">Game recaps</jp-checkbox>
    </jp-form-section></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpFormSection>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const reminders = canvas.getByRole('checkbox', { name: 'Game reminders' });
    await userEvent.click(reminders);
    await expect(reminders).toBeChecked();
    await expect(
      canvas.getByRole('group', { name: 'Club messages' }),
    ).toBeVisible();
    reminders.blur();
  },
};
export const Error: Story = {
  args: { error: 'Select at least one type of club message.' },
};
export const Disabled: Story = { args: { disabled: true } };
