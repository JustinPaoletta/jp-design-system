import { RAYS_FILE_PHOTOS } from '../game-six.example';
import { JpLink } from '../link/link';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';

import { JpAvatarGroup } from './avatar-group';

const photoCredit = componentWrapperDecorator(
  (story) =>
    `<div style="max-width:40rem">${story}<p style="font-size:var(--jp-font-size-caption);color:var(--jp-color-text-muted)">File images, not Game 6. Cropped to fit.</p>${[RAYS_FILE_PHOTOS.peralta, RAYS_FILE_PHOTOS.diaz, RAYS_FILE_PHOTOS.caminero].map((photo) => `<p style="font-size:var(--jp-font-size-caption);color:var(--jp-color-text-muted)">${photo.caption} · <a jpLink href="${photo.source}" target="_blank" rel="noopener noreferrer">Source</a> · <a jpLink href="${photo.licenseUrl}" target="_blank" rel="noopener noreferrer">${photo.license}</a></p>`).join('')}</div>`,
);

const meta: Meta<JpAvatarGroup> = {
  title: 'Primitives/Identity/Avatar Group',
  component: JpAvatarGroup,
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [JpLink] })],
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

export const PhotoMembers: Story = {
  decorators: [photoCredit],
  args: {
    people: [
      {
        id: 'a',
        name: 'Freddy Peralta',
        src: RAYS_FILE_PHOTOS.peralta.src,
      },
      {
        id: 'g',
        name: 'Yandy Díaz',
        src: RAYS_FILE_PHOTOS.diaz.src,
      },
      { id: 'l', name: 'Taylor Walls' },
      {
        id: 's',
        name: 'Junior Caminero',
        src: RAYS_FILE_PHOTOS.caminero.src,
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
