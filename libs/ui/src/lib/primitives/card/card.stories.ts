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
        <p class="game-date">2026 ALCS · Game 6</p>
        <dl class="scoreboard" aria-label="Final score">
          <div class="team winner">
            <dt>Tampa Bay Rays <span>Winner</span></dt>
            <dd><span class="sr-only">Result: </span>Win</dd>
          </div>
          <div class="team">
            <dt>ALCS Game 6 <span>Series</span></dt>
            <dd><span class="sr-only">Side: </span>—</dd>
          </div>
        </dl>
        <p class="game-summary">
          The Rays won and advanced to the World Series.
        </p>
        <div jpCardActions class="recap-actions">
          <jp-button [disabled]="saved()" (click)="saved.set(true)">
            {{ saved() ? 'Recap saved' : 'Save recap' }}
          </jp-button>
          <span role="status">{{
            saved() ? 'Saved to your game notes.' : 'ALCS Game 6 is final'
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
  args: { title: 'ALCS Game 6' },
  render: (args) => ({
    props: args,
    template: `<div style="max-inline-size: 32rem; margin: var(--jp-space-lg) auto"><jp-card [title]="title"><p>The Rays won ALCS Game 6 and advanced to the World Series.</p></jp-card></div>`,
  }),
};

export const LongContent: Story = {
  args: {
    title: 'Tampa Bay Rays roster for ALCS Game 6',
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-inline-size: 32rem; margin: var(--jp-space-lg) auto"><jp-card [title]="title"><p>The Tampa Bay Rays won ALCS Game 6. The club advanced to the World Series.</p><p>This sample roster is for the Rays.</p></jp-card></div>`,
  }),
};
