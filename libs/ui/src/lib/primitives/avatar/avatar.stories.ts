import { GAME_SIX_ILLUSTRATIONS } from '../game-six.example';
import { JpMedia } from '../media/media';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, waitFor, within } from 'storybook/test';
import { JpAvatar } from './avatar';

const illustrationCaption = componentWrapperDecorator(
  (story) =>
    `<div style="max-width:40rem">${story}<p style="font-size:var(--jp-font-size-caption);color:var(--jp-color-text-muted)">AI-generated player illustrations.</p></div>`,
);

const meta: Meta<JpAvatar> = {
  title: 'Primitives/Identity/Avatar',
  component: JpAvatar,
  parameters: { layout: 'padded' },
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
export const Illustration: Story = {
  decorators: [illustrationCaption],
  args: { src: GAME_SIX_ILLUSTRATIONS.peralta.src, size: 'lg' },
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
export const IllustrationSizes: Story = {
  decorators: [illustrationCaption],
  render: () => ({
    props: { artwork: GAME_SIX_ILLUSTRATIONS.peralta },
    template: `<div style="display:flex;align-items:center;gap:var(--jp-space-md)">
      <jp-avatar name="Freddy Peralta" [src]="artwork.src" size="sm" />
      <jp-avatar name="Freddy Peralta" [src]="artwork.src" />
      <jp-avatar name="Freddy Peralta" [src]="artwork.src" size="lg" />
    </div>`,
  }),
};

export const PlayerPortraits: Story = {
  decorators: [illustrationCaption, moduleMetadata({ imports: [JpMedia] })],
  render: () => ({
    props: {
      players: [
        { name: 'Freddy Peralta', ...GAME_SIX_ILLUSTRATIONS.peralta },
        { name: 'Yandy Díaz', ...GAME_SIX_ILLUSTRATIONS.diaz },
        { name: 'Junior Caminero', ...GAME_SIX_ILLUSTRATIONS.caminero },
      ],
    },
    template: `
      <section aria-label="Game 6 player portraits" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:var(--jp-space-lg)">
        @for (player of players; track player.name) {
          <div style="display:grid;gap:var(--jp-space-md)">
            <jp-media [src]="player.src" [alt]="player.alt" [caption]="player.name" [aspectRatio]="1" loading="eager" />
            <div style="display:flex;align-items:center;gap:var(--jp-space-md)">
              <jp-avatar [name]="player.name" [src]="player.src" size="sm" />
              <jp-avatar [name]="player.name" [src]="player.src" />
              <jp-avatar [name]="player.name" [src]="player.src" size="lg" />
            </div>
          </div>
        }
      </section>
    `,
  }),
};
