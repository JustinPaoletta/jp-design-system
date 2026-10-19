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
    title: 'Yankee Stadium',
    message: 'World Series Game 5 started at 8:08 p.m. Eastern Time.',
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
      canvas.queryByRole('region', { name: 'Yankee Stadium' }),
    ).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Show banner' }));
    await expect(
      canvas.getByRole('region', { name: 'Yankee Stadium' }),
    ).toBeVisible();
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
export const Error: Story = {
  args: {
    title: 'Score feed interrupted',
    tone: 'error',
    message:
      'The Game 5 feed stopped. The final score is Dodgers 7, Yankees 6. Try again.',
  },
};
