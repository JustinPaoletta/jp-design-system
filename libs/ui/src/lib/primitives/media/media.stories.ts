import type { Meta, StoryObj } from '@storybook/angular';
import { expect, waitFor, within } from 'storybook/test';
import { JpMedia } from './media';
const illustration =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"%3E%3Crect width="640" height="360" fill="gray"/%3E%3Ccircle cx="320" cy="180" r="100" fill="white"/%3E%3C/svg%3E';
const meta: Meta<JpMedia> = {
  title: 'Primitives/Content/Media',
  component: JpMedia,
  parameters: { layout: 'padded' },
  args: {
    src: illustration,
    alt: 'Circle illustration',
    caption: 'An original geometric illustration',
    loading: 'eager',
  },
  render: (args) => ({
    props: args,
    template:
      '<jp-media style="max-width:480px" [src]="src" [alt]="alt" [caption]="caption" [aspectRatio]="aspectRatio" [loading]="loading" />',
  }),
};
export default meta;
type Story = StoryObj<JpMedia>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      c.getByRole('img', { name: 'Circle illustration' }),
    ).toBeVisible();
    await waitFor(() =>
      expect(canvasElement.querySelector('[aria-busy]')).toHaveAttribute(
        'aria-busy',
        'false',
      ),
    );
  },
};
export const BrokenImage: Story = {
  args: { src: 'data:image/png;base64,broken' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await waitFor(() =>
      expect(
        c.getByRole('img', { name: 'Circle illustration' }),
      ).toHaveTextContent('Image unavailable'),
    );
  },
};
export const Decorative: Story = {
  args: { alt: '', caption: '', aspectRatio: 1 },
};
