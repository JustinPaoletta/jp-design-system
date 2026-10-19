import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';

import { JpBanner } from './banner';
import { JpButton } from '../button/button';

const meta: Meta<JpBanner> = {
  title: 'Primitives/Feedback/Banner',
  component: JpBanner,
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [JpButton] })],
  args: {
    title: 'Field maintenance',
    message: 'The game starts at 20:00 UTC.',
    dismissible: true,
    tone: 'info',
    announce: false,
  },
  render: (args) => ({
    props: { ...args, visible: true },
    template: `@if (visible) { <jp-banner [title]="title" [message]="message" [tone]="tone" [dismissible]="dismissible" [announce]="announce" (dismissed)="visible=false" /> } @else { <jp-button variant="secondary" (click)="visible=true">Show banner</jp-button> }`,
  }),
};
export default meta;
type Story = StoryObj<JpBanner>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Dismiss banner' }),
    );
    await expect(
      canvas.queryByRole('region', { name: 'Field maintenance' }),
    ).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Show banner' }));
    await expect(
      canvas.getByRole('region', { name: 'Field maintenance' }),
    ).toBeVisible();
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
export const Error: Story = {
  args: {
    title: 'Score feed interrupted',
    tone: 'error',
    message: 'Your lineup has been kept. Try again.',
  },
};
