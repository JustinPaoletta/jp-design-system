import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpSkipLink } from './skip-link';
import { moduleMetadata } from '@storybook/angular';
import { JpLink } from '../link/link';
const meta: Meta<JpSkipLink> = {
  title: 'Primitives/Accessibility/Skip Link',
  component: JpSkipLink,
  decorators: [moduleMetadata({ imports: [JpLink] })],
  parameters: { layout: 'padded' },
  render: () => ({
    template:
      '<jp-skip-link target="story-content" /><p>Press Tab to reveal the skip link.</p><main id="story-content"><h1>Game day</h1><a jpLink href="#story-content">View starting lineup</a></main>',
  }),
};
export default meta;
type Story = StoryObj<JpSkipLink>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const link = c.getByRole('link', { name: 'Skip to content' });
    link.focus();
    await userEvent.keyboard('{Enter}');
    await expect(c.getByRole('main')).toHaveFocus();
    link.focus();
    await expect(link).toHaveFocus();
  },
};
