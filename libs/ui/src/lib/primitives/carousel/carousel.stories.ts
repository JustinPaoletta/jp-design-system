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
  args: { id: 'story-guide', label: 'Join the Falcons' },
  render: (args) => ({
    props: args,
    template: `<jp-carousel style="max-width:40rem" [id]="id" [label]="label" [autoRotate]="autoRotate" [disabled]="disabled" [loop]="loop">
    <ng-template jpCarouselSlide="access" label="Invite club members"><h2>Invite club members</h2><p>Invite players and coaches to the Falcons club.</p><jp-button>Open club invitations</jp-button></ng-template>
    <ng-template jpCarouselSlide="priorities" label="Set priorities"><h2>Set priorities</h2><p>Check the lineup, inspect the field and prepare the equipment.</p><jp-input label="Coach note" /></ng-template>
    <ng-template jpCarouselSlide="review" label="Review progress"><h2>Review progress</h2><p>Review the final score and prepare for the next game.</p></ng-template>
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
