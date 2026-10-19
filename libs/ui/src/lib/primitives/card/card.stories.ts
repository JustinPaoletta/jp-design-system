import { Component, input, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpBadge } from '../badge/badge';
import { JpButton } from '../button/button';
import { JpCard } from './card';

@Component({
  selector: 'jp-card-reference',
  imports: [JpCard, JpBadge, JpButton],
  styleUrl: './card.stories.scss',
  template: `
    <div class="card-stage">
      <jp-card [title]="title()">
        <jp-badge jpCardHeader tone="neutral" size="sm">Final</jp-badge>
        <p class="game-date">October 11, 2026 · Riverton Field</p>
        <dl class="scoreboard" aria-label="Final score">
          <div class="team winner">
            <dt>Riverton Falcons <span>Home</span></dt>
            <dd><span class="sr-only">Runs: </span>5</dd>
          </div>
          <div class="team">
            <dt>Lakeview Bears <span>Away</span></dt>
            <dd><span class="sr-only">Runs: </span>3</dd>
          </div>
        </dl>
        <p class="game-summary">Nine hits. No errors. A Falcons win.</p>
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
  readonly title = input('Game recap');
  readonly saved = signal(false);
}

const meta: Meta<JpCard> = {
  title: 'Primitives/Layout/Card',
  component: JpCard,
  decorators: [moduleMetadata({ imports: [JpButton, CardReferenceStory] })],
  parameters: { layout: 'padded' },
  args: { title: 'Game recap' },
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
      canvas.getByRole('heading', { name: 'Game recap' }),
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
  args: { title: 'Next game' },
  render: (args) => ({
    props: args,
    template: `<div style="max-inline-size: 32rem; margin: var(--jp-space-lg) auto"><jp-card [title]="title"><p>The Falcons play the Bears on October 12 at 18:30 at Riverton Field.</p></jp-card></div>`,
  }),
};

export const LongContent: Story = {
  args: {
    title: 'Riverton Falcons postseason preparation and player availability',
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-inline-size: 32rem; margin: var(--jp-space-lg) auto"><jp-card [title]="title"><p>Coach Sam Rivera will review the starting lineup before the next game. Jordan Davis is day to day. Taylor Reed remains injured.</p><p>All other players should arrive at Riverton Field for batting and fielding drills.</p></jp-card></div>`,
  }),
};
