import { RAYS_FILE_PHOTOS } from '../game-six.example';
import { JpLink } from '../link/link';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, waitFor, within } from 'storybook/test';
import { JpAvatar } from './avatar';

const photoCredit = componentWrapperDecorator(
  (story) =>
    `<div style="max-width:40rem">${story}<p style="font-size:var(--jp-font-size-caption);color:var(--jp-color-text-muted)">File images, not Game 6. Cropped to fit.</p>${[RAYS_FILE_PHOTOS.peralta].map((photo) => `<p style="font-size:var(--jp-font-size-caption);color:var(--jp-color-text-muted)">${photo.caption} · <a jpLink href="${photo.source}" target="_blank" rel="noopener noreferrer">Source</a> · <a jpLink href="${photo.licenseUrl}" target="_blank" rel="noopener noreferrer">${photo.license}</a></p>`).join('')}</div>`,
);

const meta: Meta<JpAvatar> = {
  title: 'Primitives/Identity/Avatar',
  component: JpAvatar,
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [JpLink] })],
  args: { name: 'Freddy Peralta' },
};
export default meta;
type Story = StoryObj<JpAvatar>;
export const Default: Story = {};
export const BrokenImage: Story = {
  args: { src: 'data:image/png;base64,broken' },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('img')).toBeNull());
    await expect(
      within(canvasElement).getByRole('img', { name: 'Freddy Peralta' }),
    ).toHaveTextContent('FP');
  },
};
export const Photo: Story = {
  decorators: [photoCredit],
  args: { src: RAYS_FILE_PHOTOS.peralta.src, size: 'lg' },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector('img')).toHaveClass('loaded'),
    );
    const img = canvasElement.querySelector('img') as HTMLImageElement;
    await expect(img.naturalWidth).toBeGreaterThan(0);
    await expect(getComputedStyle(img).objectFit).toBe('cover');
    await expect(
      within(canvasElement).getByRole('img', { name: 'Freddy Peralta' }),
    ).not.toHaveAttribute('aria-busy');
  },
};
export const PhotoSizes: Story = {
  decorators: [photoCredit],
  render: () => ({
    props: { photo: RAYS_FILE_PHOTOS.peralta },
    template: `<div style="display:flex;align-items:center;gap:var(--jp-space-md)">
      <jp-avatar name="Freddy Peralta" [src]="photo.src" size="sm" />
      <jp-avatar name="Freddy Peralta" [src]="photo.src" />
      <jp-avatar name="Freddy Peralta" [src]="photo.src" size="lg" />
    </div>`,
  }),
};
