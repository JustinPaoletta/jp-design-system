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
    title: 'No deployments',
    description: 'Create a deployment to see it listed here.',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-empty-state [title]="title" [description]="description">
        <span jpEmptyStateIcon aria-hidden="true">◇</span>
        <jp-button variant="primary">New deployment</jp-button>
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
    ).toContain('No deployments');
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Nothing here',
    description: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-empty-state [title]="title" [description]="description" />
    `,
  }),
};
