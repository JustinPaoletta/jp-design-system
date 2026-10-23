import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpButton } from '../button/button';
import { JpPageHeader } from './page-header';

const meta: Meta<JpPageHeader> = {
  title: 'Primitives/Layout/Page Header',
  component: JpPageHeader,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="max-inline-size:60rem;margin:var(--jp-space-lg) auto">${story}</div>`,
    ),
    moduleMetadata({ imports: [JpButton] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    title: 'Game 6 roster',
    headingLevel: 'h1',
    description: 'Explore the Rays who won the 2026 American League pennant.',
  },
  render: (args) => ({
    props: { ...args, saved: false },
    template: `<jp-page-header [title]="title" [description]="description" [headingLevel]="headingLevel">
      <span jpPageMeta role="status">{{ saved ? 'Roster saved in this preview.' : '2026 ALCS · Game 6' }}</span>
      <jp-button jpPageActions [disabled]="saved" (click)="saved = true">{{ saved ? 'Roster saved' : 'Save roster' }}</jp-button>
    </jp-page-header>`,
  }),
};
export default meta;
type Story = StoryObj<JpPageHeader>;
export const Default: Story = {};
export const Saved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save roster' }));
    await expect(
      canvas.getByRole('button', { name: 'Roster saved' }),
    ).toBeDisabled();
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Roster saved in this preview.',
    );
  },
};
export const LongContent: Story = {
  args: {
    title: 'The Game 6 players',
    description:
      'Explore the players who helped Tampa Bay win Game 6 at Tropicana Field on October 19, 2026.',
  },
};
