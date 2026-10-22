import { RAYS_FILE_PHOTOS } from '../game-six.example';
import { JpLink } from '../link/link';
import { JpMedia } from '../media/media';
import { Component, input, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpBadge } from '../badge/badge';
import { JpButton } from '../button/button';
import { JpCard } from './card';

@Component({
  selector: 'jp-card-reference',
  imports: [JpCard, JpBadge, JpButton, JpMedia, JpLink],
  styleUrl: './card.stories.scss',
  template: `
    <div class="card-stage">
      <jp-card [title]="title()">
        <jp-badge jpCardHeader tone="neutral" size="sm">Final</jp-badge>
        <jp-media
          [src]="photo.src"
          [alt]="photo.alt"
          [caption]="photo.caption"
          [aspectRatio]="4 / 3"
          loading="eager"
        />
        <p class="game-date">
          File photo, not Game 6.
          <a
            jpLink
            [href]="photo.source"
            target="_blank"
            rel="noopener noreferrer"
            >Source</a
          >
          ·
          <a
            jpLink
            [href]="photo.licenseUrl"
            target="_blank"
            rel="noopener noreferrer"
            >{{ photo.license }}</a
          >
        </p>
        <p class="game-date">October 19, 2026 · Tropicana Field</p>
        <dl class="scoreboard" aria-label="Final score">
          <div class="team winner">
            <dt>Tampa Bay Rays <span>Home</span></dt>
            <dd><span class="sr-only">Runs: </span>7</dd>
          </div>
          <div class="team">
            <dt>Cleveland Guardians <span>Away</span></dt>
            <dd><span class="sr-only">Runs: </span>3</dd>
          </div>
        </dl>
        <p class="game-summary">
          Seven runs. One pennant. A night to remember.
        </p>
        <div jpCardActions class="recap-actions">
          <jp-button [disabled]="saved()" (click)="saved.set(true)">
            {{ saved() ? 'Recap saved' : 'Save recap' }}
          </jp-button>
          <span role="status">{{
            saved() ? 'Saved to your game notes.' : 'Final in 9 innings'
          }}</span>
        </div>
      </jp-card>
    </div>
  `,
})
class CardReferenceStory {
  readonly photo = RAYS_FILE_PHOTOS.venue;
  readonly title = input('American League champions');
  readonly saved = signal(false);
}

const meta: Meta<JpCard> = {
  title: 'Primitives/Layout/Card',
  component: JpCard,
  decorators: [moduleMetadata({ imports: [JpButton, CardReferenceStory] })],
  parameters: { layout: 'padded' },
  args: { title: 'American League champions' },
  render: (args) => ({
    props: args,
    template: `<jp-card-reference [title]="title" />`,
  }),
};
export default meta;
type Story = StoryObj<JpCard>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'American League champions' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Save recap' }),
    ).toBeEnabled();
  },
};

export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save recap' }));
    await expect(
      canvas.getByRole('button', { name: 'Recap saved' }),
    ).toBeDisabled();
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Saved to your game notes.',
    );
  },
};

export const Plain: Story = {
  args: { title: 'Game 6' },
  render: (args) => ({
    props: args,
    template: `<div style="max-inline-size: 32rem; margin: var(--jp-space-lg) auto"><jp-card [title]="title"><p>Tampa Bay clinched the American League pennant on October 19, 2026. The Rays beat Cleveland 7–3 at Tropicana Field and won the series 4–2.</p></jp-card></div>`,
  }),
};

export const LongContent: Story = {
  args: {
    title: 'The players who brought the pennant home',
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-inline-size: 32rem; margin: var(--jp-space-lg) auto"><jp-card [title]="title"><p>Freddy Peralta set the tone with 5⅓ innings of one-run pitching. Richie Palacios put Tampa Bay ahead with a two-run double in the second.</p><p>Junior Caminero homered in the seventh. Yandy Díaz added a two-run shot in the eighth. In the ninth, Liam Hicks caught the final out, and Tampa Bay celebrated its third American League pennant.</p></jp-card></div>`,
  }),
};
