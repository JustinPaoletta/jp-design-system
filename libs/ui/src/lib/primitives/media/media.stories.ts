import type { Meta, StoryObj } from '@storybook/angular';
import { expect, waitFor, within } from 'storybook/test';
import { JpMedia } from './media';
const fieldDrawing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="%2322302a"/><path d="M320 322 70 75Q320-80 570 75Z" fill="%23394f37"/><path d="m320 300-100-100 100-100 100 100Z" fill="%23aa8960"/><path d="m320 282-82-82 82-82 82 82Z" fill="%234d6944"/><path d="M320 300 95 75m225 225L545 75" stroke="%23f1f4f6" stroke-width="3"/><circle cx="320" cy="200" r="14" fill="%23aa8960"/><path d="m320 295-5 5 5 7 5-7Z" fill="%23f1f4f6"/><path d="m218 198 4-4 4 4-4 4Zm98-98 4-4 4 4-4 4Zm98 98 4-4 4 4-4 4Z" fill="%23f1f4f6"/></svg>`;
const illustration = 'data:image/svg+xml,' + fieldDrawing;
const meta: Meta<JpMedia> = {
  title: 'Primitives/Content/Media',
  component: JpMedia,
  parameters: { layout: 'padded' },
  args: {
    src: illustration,
    alt: 'Riverton Field diamond diagram',
    caption: 'Riverton Field · Falcons home diamond',
    loading: 'eager',
  },
  render: (args) => ({
    props: args,
    template:
      '<jp-media style="max-width:480px" [src]="src" [alt]="alt" [caption]="caption" [aspectRatio]="aspectRatio" [loading]="loading" [fit]="fit" />',
  }),
};
export default meta;
type Story = StoryObj<JpMedia>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      c.getByRole('img', { name: 'Riverton Field diamond diagram' }),
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
        c.getByRole('img', { name: 'Riverton Field diamond diagram' }),
      ).toHaveTextContent('Image unavailable'),
    );
  },
};
export const Decorative: Story = {
  args: { alt: '', caption: '', aspectRatio: 1 },
};

export const Portrait: Story = {
  args: {
    aspectRatio: 3 / 4,
    fit: 'cover',
    caption: 'Portrait crop of the Riverton Field diagram',
  },
};
export const Transparent: Story = {
  args: {
    src: 'data:image/svg+xml,' + fieldDrawing.replace(/<rect[^>]+\/>/, ''),
    fit: 'contain',
    caption: 'Field diagram with a transparent background',
  },
};
