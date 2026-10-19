import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpButton } from '../button/button';
import { JpInput } from '../input/input';
import { JpCarousel, JpCarouselSlide } from './carousel';
const meta: Meta<JpCarousel> = {
  title: 'Primitives/Content/Carousel',
  component: JpCarousel,
  decorators: [
    moduleMetadata({ imports: [JpCarouselSlide, JpButton, JpInput] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    id: 'story-guide',
    label: 'Join the Dodgers',
    loop: true,
    autoRotate: false,
    disabled: false,
  },
  render: (args) => ({
    props: { ...args, invitationsOpen: false },
    template: `<jp-carousel style="max-width:40rem" [id]="id" [label]="label" [autoRotate]="autoRotate" [disabled]="disabled" [loop]="loop">
    <ng-template jpCarouselSlide="access" label="Invite club members"><h2>Invite club members</h2><p>Invite players and coaches to the Dodgers club.</p><jp-button (click)="invitationsOpen=!invitationsOpen">{{ invitationsOpen ? 'Close club invitations' : 'Open club invitations' }}</jp-button>@if (invitationsOpen) { <section aria-label="Club invitations"><h3>Pending invitations</h3><p>Freddie Freeman and Tommy Edman have been invited to the Dodgers.</p></section> }</ng-template>
    <ng-template jpCarouselSlide="priorities" label="Set priorities"><h2>Set priorities</h2><p>Check the lineup, inspect the field and prepare the equipment.</p><jp-input label="Manager note" /></ng-template>
    <ng-template jpCarouselSlide="review" label="Review progress"><h2>Review progress</h2><p>The Dodgers won World Series Game 5, 7–6.</p></ng-template>
  </jp-carousel>`,
  }),
};
export default meta;
type Story = StoryObj<JpCarousel>;
export const Default: Story = {};
export const Bounded: Story = { args: { loop: false } };
export const Disabled: Story = { args: { disabled: true } };
export const RotationOptIn: Story = { args: { autoRotate: true } };
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      c.getByRole('heading', { name: 'Invite club members' }),
    ).toBeVisible();
    await expect(
      c.queryByRole('button', { name: 'Open club invitations', hidden: false }),
    ).toBeVisible();
    await userEvent.click(
      c.getByRole('button', { name: 'Open club invitations' }),
    );
    await expect(
      c.getByRole('region', { name: 'Club invitations' }),
    ).toBeVisible();
    await userEvent.click(
      c.getByRole('button', { name: 'Close club invitations' }),
    );
    await expect(
      c.queryByRole('region', { name: 'Club invitations' }),
    ).toBeNull();
    await userEvent.click(c.getByRole('button', { name: 'Next slide' }));
    await expect(
      c.getByRole('heading', { name: 'Set priorities' }),
    ).toBeVisible();
    await expect(
      c.queryByRole('button', { name: 'Open club invitations' }),
    ).toBeNull();
    const viewport = canvasElement.querySelector<HTMLElement>('.viewport');
    viewport?.focus();
    await userEvent.keyboard('{End}');
    await expect(
      c.getByRole('heading', { name: 'Review progress' }),
    ).toBeVisible();
    await userEvent.keyboard('{Home}');
    await expect(
      c.getByRole('heading', { name: 'Invite club members' }),
    ).toBeVisible();
  },
};
