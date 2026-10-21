import type { Meta, StoryObj } from '@storybook/angular';
import { expect, waitFor, within } from 'storybook/test';
import { JpAvatar } from './avatar';

const meta: Meta<JpAvatar> = {
  title: 'Primitives/Identity/Avatar',
  component: JpAvatar,
  parameters: { layout: 'padded' },
  args: { name: 'Jack Flaherty' },
};
export default meta;
type Story = StoryObj<JpAvatar>;
export const Default: Story = {};
export const BrokenImage: Story = {
  args: { src: 'data:image/png;base64,broken' },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('img')).toBeNull());
    await expect(
      within(canvasElement).getByRole('img', { name: 'Jack Flaherty' }),
    ).toHaveTextContent('JF');
  },
};
export const Photo: Story = {
  args: { src: 'example-photos/baseball-cap.jpg', size: 'lg' },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector('img')).toHaveClass('loaded'),
    );
    const img = canvasElement.querySelector('img') as HTMLImageElement;
    await expect(img.naturalWidth).toBeGreaterThan(0);
    await expect(getComputedStyle(img).objectFit).toBe('cover');
    await expect(
      within(canvasElement).getByRole('img', { name: 'Jack Flaherty' }),
    ).not.toHaveAttribute('aria-busy');
  },
};
export const PhotoSizes: Story = {
  render: () => ({
    template: `<div style="display:flex;align-items:center;gap:var(--jp-space-md)">
      <jp-avatar name="Jack Flaherty" src="example-photos/baseball-cap.jpg" size="sm" />
      <jp-avatar name="Jack Flaherty" src="example-photos/baseball-cap.jpg" />
      <jp-avatar name="Jack Flaherty" src="example-photos/baseball-cap.jpg" size="lg" />
    </div>`,
  }),
};
