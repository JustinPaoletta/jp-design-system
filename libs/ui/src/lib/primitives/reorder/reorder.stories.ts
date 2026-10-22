import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpReorder } from './reorder';
const meta: Meta<JpReorder> = {
  title: 'Primitives/Selection/Reorder',
  component: JpReorder,
  parameters: { layout: 'padded' },
  args: {
    id: 'story-priorities',
    label: 'Collection priorities',
    items: [
      {
        id: 'audit',
        label: 'Choose your Game 6 highlights',
        description:
          'Start with Palacios’s double, the two home runs and the final out.',
      },
      { id: 'docs', label: 'Read the Game 6 lineup' },
      { id: 'release', label: 'Write your Game 6 memory' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpReorder>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Empty: Story = { args: { items: [] } };
export const KeyboardAndCancel: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const handle = c.getByRole('button', {
      name: 'Reorder: Choose your Game 6 highlights',
    });
    await userEvent.click(handle);
    await userEvent.keyboard('{End}');
    await expect(c.getByRole('status')).toHaveTextContent('3 of 3');
    await userEvent.keyboard('{Escape}');
    await expect(c.getAllByRole('listitem')[0]).toHaveTextContent(
      'Choose your Game 6 highlights',
    );
    await userEvent.click(
      c.getByRole('button', {
        name: 'Move down: Choose your Game 6 highlights',
      }),
    );
    await expect(c.getAllByRole('listitem')[1]).toHaveTextContent(
      'Choose your Game 6 highlights',
    );
    await userEvent.click(handle);
    await userEvent.keyboard('{Home}{Enter}');
    await expect(c.getAllByRole('listitem')[0]).toHaveTextContent(
      'Choose your Game 6 highlights',
    );
    await expect(handle).toHaveFocus();
  },
};
