import { GAME_SIX_ILLUSTRATIONS } from '../game-six.example';
import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';

import { JpAvatarGroup } from './avatar-group';

const illustrationCaption = componentWrapperDecorator(
  (story) =>
    `<div style="max-width:40rem">${story}<p style="font-size:var(--jp-font-size-caption);color:var(--jp-color-text-muted)">AI-generated player illustrations.</p></div>`,
);

const meta: Meta<JpAvatarGroup> = {
  title: 'Primitives/Identity/Avatar Group',
  component: JpAvatarGroup,
  parameters: { layout: 'padded' },
  args: {
    label: 'Players',
    people: [
      { id: 'a', name: 'Freddy Peralta' },
      { id: 'g', name: 'Yandy Díaz' },
      { id: 'l', name: 'Taylor Walls' },
    ],
    max: 2,
  },
};
export default meta;
type Story = StoryObj<JpAvatarGroup>;
export const Default: Story = {};

export const IllustratedMembers: Story = {
  decorators: [illustrationCaption],
  args: {
    people: [
      {
        id: 'a',
        name: 'Freddy Peralta',
        src: GAME_SIX_ILLUSTRATIONS.peralta.src,
      },
      {
        id: 'g',
        name: 'Yandy Díaz',
        src: GAME_SIX_ILLUSTRATIONS.diaz.src,
      },
      { id: 'l', name: 'Taylor Walls' },
      {
        id: 's',
        name: 'Junior Caminero',
        src: GAME_SIX_ILLUSTRATIONS.caminero.src,
      },
      { id: 'r', name: 'Richie Palacios' },
    ],
    max: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Show 3 more items' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('region', { name: 'Players' })).toHaveFocus();
    await expect(canvas.getByText('Taylor Walls')).toBeVisible();
    await expect(canvas.getByText('Junior Caminero')).toBeVisible();
    await expect(canvas.getByText('Richie Palacios')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};
