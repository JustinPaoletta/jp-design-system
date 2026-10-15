import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpBreadcrumbs } from './breadcrumbs';

const meta: Meta<JpBreadcrumbs> = {
  title: 'Primitives/Navigation/Breadcrumbs',
  component: JpBreadcrumbs,
  parameters: { layout: 'padded' },
  args: {
    ariaLabel: 'Club structure',
    items: [
      { label: 'Clubs', href: '#projects' },
      { label: 'Riverton Falcons', href: '#design-system' },
      { label: 'Settings' },
    ],
  },
};
export default meta;
type Story = StoryObj<JpBreadcrumbs>;

export const ProjectSettings: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('navigation', { name: 'Club structure' }),
    ).toBeVisible();
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
    await expect(canvas.getByText('Settings')).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};
export const LongHierarchy: Story = {
  args: {
    items: [
      { label: 'League', href: '#organization' },
      { label: 'Clubhouse', href: '#workspace' },
      { label: 'Clubs', href: '#projects' },
      { label: 'Riverton Falcons', href: '#design-system' },
      { label: 'Component accessibility settings' },
    ],
  },
};
