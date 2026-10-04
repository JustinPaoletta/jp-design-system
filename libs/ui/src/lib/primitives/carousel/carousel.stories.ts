import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpCarousel, JpCarouselSlide } from './carousel';
const meta: Meta<JpCarousel> = {
  title: 'Primitives/Content/Carousel',
  component: JpCarousel,
  decorators: [moduleMetadata({ imports: [JpCarouselSlide] })],
  parameters: { layout: 'padded' },
  args: { id: 'story-guide', label: 'Getting started' },
  render: (args) => ({
    props: args,
    template: `<jp-carousel [id]="id" [label]="label" [autoRotate]="autoRotate" [disabled]="disabled" [loop]="loop">
    <ng-template jpCarouselSlide="access" label="Invite your team"><h2>Invite your team</h2><p>Start with a small workspace and clear ownership.</p><button type="button">Open invitations</button></ng-template>
    <ng-template jpCarouselSlide="priorities" label="Set priorities"><h2>Set priorities</h2><p>Choose the first three outcomes for your team.</p><input aria-label="Workspace note" /></ng-template>
    <ng-template jpCarouselSlide="review" label="Review progress"><h2>Review progress</h2><p>Use a regular review to keep work moving.</p></ng-template>
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
      c.getByRole('heading', { name: 'Invite your team' }),
    ).toBeVisible();
    await expect(
      c.queryByRole('button', { name: 'Open invitations', hidden: false }),
    ).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Next slide' }));
    await expect(
      c.getByRole('heading', { name: 'Set priorities' }),
    ).toBeVisible();
    await expect(
      c.queryByRole('button', { name: 'Open invitations' }),
    ).toBeNull();
    const viewport = canvasElement.querySelector<HTMLElement>('.viewport');
    viewport?.focus();
    await userEvent.keyboard('{End}');
    await expect(
      c.getByRole('heading', { name: 'Review progress' }),
    ).toBeVisible();
    await userEvent.keyboard('{Home}');
    await expect(
      c.getByRole('heading', { name: 'Invite your team' }),
    ).toBeVisible();
  },
};
