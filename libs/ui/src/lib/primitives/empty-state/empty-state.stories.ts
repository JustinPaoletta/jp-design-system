import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpButton } from '../button/button';
import { JpEmptyState } from './empty-state';

const meta: Meta<JpEmptyState> = {
  title: 'Primitives/Data Display/Empty State',
  component: JpEmptyState,
  decorators: [
    moduleMetadata({
      imports: [JpEmptyState, JpButton],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'No matching Game 6 players',
    description: 'Add a player to see them on the roster.',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-empty-state [title]="title" [description]="description">
        <svg jpEmptyStateIcon aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2m3-13v6m-3-3h6"/></svg>
        <jp-button variant="primary">Add player</jp-button>
      </jp-empty-state>
    `,
  }),
};

export default meta;
type Story = StoryObj<JpEmptyState>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-empty-state');
    await expect(host?.getAttribute('role')).toBe('status');
    await expect(
      canvasElement.querySelector('.jp-empty-state__title')?.textContent,
    ).toContain('No matching Game 6 players');
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'All game reports are complete',
    description: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-empty-state [title]="title" [description]="description" />
    `,
  }),
};

export const WithoutAction: Story = {
  args: {
    title: 'No players match your search',
    description: 'Change the player name or clear the position filter.',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-empty-state [title]="title" [description]="description">
        <svg jpEmptyStateIcon aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2m3-13v6m-3-3h6"/></svg>
      </jp-empty-state>
    `,
  }),
};
