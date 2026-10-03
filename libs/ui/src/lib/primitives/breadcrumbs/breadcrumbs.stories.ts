import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpBreadcrumbs } from './breadcrumbs';

const meta: Meta<JpBreadcrumbs> = {
  title: 'Primitives/Navigation/Breadcrumbs',
  component: JpBreadcrumbs,
  parameters: { layout: 'padded' },
  args: {
    ariaLabel: 'Project hierarchy',
    items: [
      { label: 'Projects', href: '#projects' },
      { label: 'Design system', href: '#design-system' },
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
      canvas.getByRole('navigation', { name: 'Project hierarchy' }),
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
      { label: 'Organization', href: '#organization' },
      { label: 'Workspace', href: '#workspace' },
      { label: 'Projects', href: '#projects' },
      { label: 'Design system', href: '#design-system' },
      { label: 'Component accessibility settings' },
    ],
  },
};
