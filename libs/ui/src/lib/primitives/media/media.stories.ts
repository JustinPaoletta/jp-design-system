import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { JpMedia } from './media';
import { JpButton } from '../button/button';
const fieldDrawing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="%2322302a"/><path d="M320 322 70 75Q320-80 570 75Z" fill="%23394f37"/><path d="m320 300-100-100 100-100 100 100Z" fill="%23aa8960"/><path d="m320 282-82-82 82-82 82 82Z" fill="%234d6944"/><path d="M320 300 95 75m225 225L545 75" stroke="%23f1f4f6" stroke-width="3"/><circle cx="320" cy="200" r="14" fill="%23aa8960"/><path d="m320 295-5 5 5 7 5-7Z" fill="%23f1f4f6"/><path d="m218 198 4-4 4 4-4 4Zm98-98 4-4 4 4-4 4Zm98 98 4-4 4 4-4 4Z" fill="%23f1f4f6"/></svg>`;
const illustration = 'data:image/svg+xml,' + fieldDrawing;
const meta: Meta<JpMedia> = {
  title: 'Primitives/Content/Media',
  component: JpMedia,
  decorators: [moduleMetadata({ imports: [JpButton] })],
  parameters: { layout: 'padded' },
  args: {
    src: illustration,
    alt: 'Riverton Field diamond diagram',
    caption: 'Riverton Field · Falcons home diamond',
    loading: 'eager',
    fit: 'cover',
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
    const image = c.getByRole('img', {
      name: 'Riverton Field diamond diagram',
    });
    await waitFor(() => expect(image).toHaveClass('loaded'));
    await expect(image).toBeVisible();
    await expect(getComputedStyle(image).objectFit).toBe('cover');
    await expect(canvasElement.querySelector('[aria-busy]')).toHaveAttribute(
      'aria-busy',
      'false',
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

export const Photo: Story = {
  args: {
    src: '/example-photos/baseball-field.jpg',
    alt: 'Baseball field with a diamond and spectator stands',
    caption: 'Falcons field notes · Photo example',
  },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector('img')).toHaveClass('loaded'),
    );
    const img = canvasElement.querySelector('img') as HTMLImageElement;
    await expect(img.naturalWidth).toBeGreaterThan(0);
    await expect(getComputedStyle(img).objectFit).toBe('cover');
  },
};
export const PhotoPortraitCrop: Story = {
  ...Photo,
  args: {
    ...Photo.args,
    aspectRatio: 3 / 4,
    caption: 'Falcons field notes · Portrait crop',
  },
};
export const PhotoContain: Story = {
  args: {
    ...Photo.args,
    aspectRatio: 1,
    fit: 'contain',
    caption: 'Falcons field notes · Full photo in a square frame',
  },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector('img')).toHaveClass('loaded'),
    );
    const img = canvasElement.querySelector('img') as HTMLImageElement;
    await expect(getComputedStyle(img).objectFit).toBe('contain');
  },
};
export const PhotoRecovery: Story = {
  render: () => ({
    props: { source: 'data:image/png;base64,broken' },
    template: `<div style="display:grid;gap:var(--jp-space-md);max-width:480px">
      <jp-media [src]="source" alt="Baseball field with a diamond and spectator stands" caption="Falcons field notes · Retry the photo" loading="eager" />
      <jp-button variant="secondary" (click)="source='/example-photos/baseball-field.jpg'">Reload photo</jp-button>
    </div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByRole('img', {
          name: 'Baseball field with a diamond and spectator stands',
        }),
      ).toHaveTextContent('Image unavailable'),
    );
    const frame = canvasElement.querySelector(
      '.jp-media__frame',
    ) as HTMLElement;
    const height = frame.getBoundingClientRect().height;
    await userEvent.click(canvas.getByRole('button', { name: 'Reload photo' }));
    await waitFor(() =>
      expect(canvasElement.querySelector('img')).toHaveClass('loaded'),
    );
    await expect(frame.getBoundingClientRect().height).toBeCloseTo(height, 1);
    await expect(frame).toHaveAttribute('aria-busy', 'false');
  },
};
