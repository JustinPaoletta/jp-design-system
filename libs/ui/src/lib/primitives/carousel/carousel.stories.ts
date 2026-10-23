import { JpLink } from '../link/link';
import { GAME_SIX, GAME_SIX_ILLUSTRATIONS } from '../game-six.example';
import { JpMedia } from '../media/media';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpButton } from '../button/button';
import { JpInput } from '../input/input';
import { JpCarousel, JpCarouselSlide } from './carousel';
const meta: Meta<JpCarousel> = {
  title: 'Primitives/Content/Carousel',
  component: JpCarousel,
  decorators: [
    moduleMetadata({
      imports: [JpCarouselSlide, JpButton, JpInput, JpMedia, JpLink],
    }),
  ],
  parameters: { layout: 'padded' },
  args: {
    id: 'story-guide',
    label: 'A pennant to remember',
    loop: true,
    autoRotate: false,
    disabled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      invitationsOpen: false,
      artwork: GAME_SIX_ILLUSTRATIONS,
      game: GAME_SIX,
    },
    template: `
      <jp-carousel style="max-width:40rem" [id]="id" [label]="label" [autoRotate]="autoRotate" [disabled]="disabled" [loop]="loop">
        <ng-template jpCarouselSlide="access" label="The night Tampa Bay clinched">
          <h2>The night Tampa Bay clinched</h2>
          <jp-media [src]="artwork.celebration.src" [alt]="artwork.celebration.alt" [caption]="artwork.celebration.caption" [aspectRatio]="3 / 2" loading="eager" />
          <p>October 19, 2026. Rays 7, Guardians 3. The American League pennant belongs to Tampa Bay.</p>
          <jp-button (click)="invitationsOpen=!invitationsOpen">{{ invitationsOpen ? 'Close game details' : 'Read game details' }}</jp-button>
          @if (invitationsOpen) {
            <section aria-label="Game details">
              <h3>A home-field celebration</h3>
              <p>40,230 fans filled Tropicana Field. Tampa Bay won the series four games to two.</p>
              <a jpLink [href]="game.recapUrl" target="_blank" rel="noopener noreferrer">Read the MLB recap</a>
            </section>
          }
        </ng-template>
        <ng-template jpCarouselSlide="priorities" label="The final out">
          <h2>The final out</h2>
          <jp-media [src]="artwork.finalOut.src" [alt]="artwork.finalOut.alt" [caption]="artwork.finalOut.caption" [aspectRatio]="3 / 2" loading="eager" />
          <p>With two outs in the ninth, Chase DeLauter lifted a foul pop. Liam Hicks made the catch, and the Rays had their third American League pennant.</p>
          <jp-input label="Your Game 6 memory" hint="Add a personal note about this night." />
        </ng-template>
        <ng-template jpCarouselSlide="review" label="American League champions">
          <h2>American League champions</h2>
          <jp-media style="max-width:20rem;display:block" [src]="artwork.peralta.src" [alt]="artwork.peralta.alt" [caption]="artwork.peralta.caption" [aspectRatio]="1" fit="contain" loading="eager" />
          <p>Freddy Peralta earned ALCS MVP honors. In Game 6, he allowed one earned run in 5⅓ innings.</p>
          <a jpLink [href]="game.recapUrl" target="_blank" rel="noopener noreferrer">Read the Game 6 report</a>
        </ng-template>
      </jp-carousel>`,
  }),
};
export default meta;
type Story = StoryObj<JpCarousel>;
export const Default: Story = {};
export const Narrow: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width:20rem">${story}</div>`,
    ),
  ],
};
export const RightToLeft: Story = {
  decorators: [
    componentWrapperDecorator((story) => `<div dir="rtl">${story}</div>`),
  ],
};
export const Bounded: Story = { args: { loop: false } };
export const Disabled: Story = { args: { disabled: true } };
export const RotationOptIn: Story = { args: { autoRotate: true } };
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      c.getByRole('heading', { name: 'The night Tampa Bay clinched' }),
    ).toBeVisible();
    await expect(
      c.queryByRole('button', { name: 'Read game details', hidden: false }),
    ).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Read game details' }));
    await expect(c.getByRole('region', { name: 'Game details' })).toBeVisible();
    await userEvent.click(
      c.getByRole('button', { name: 'Close game details' }),
    );
    await expect(c.queryByRole('region', { name: 'Game details' })).toBeNull();
    await userEvent.click(c.getByRole('button', { name: 'Next slide' }));
    await expect(
      c.getByRole('heading', { name: 'The final out' }),
    ).toBeVisible();
    await expect(
      c.queryByRole('button', { name: 'Read game details' }),
    ).toBeNull();
    const viewport = canvasElement.querySelector<HTMLElement>('.viewport');
    viewport?.focus();
    await userEvent.keyboard('{End}');
    await expect(
      c.getByRole('heading', { name: 'American League champions' }),
    ).toBeVisible();
    await userEvent.keyboard('{Home}');
    await expect(
      c.getByRole('heading', { name: 'The night Tampa Bay clinched' }),
    ).toBeVisible();
  },
};
