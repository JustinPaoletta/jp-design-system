import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { JpBreadcrumbs } from './breadcrumbs';

const meta: Meta<JpBreadcrumbs> = {
  title: 'Primitives/Navigation/Breadcrumbs',
  component: JpBreadcrumbs,
  parameters: { layout: 'padded' },
  args: {
    ariaLabel: 'Club structure',
    maxItems: 5,
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
      { label: 'Roster notification preferences' },
    ],
  },
};

export const NarrowContainer: Story = {
  ...LongHierarchy,
  render: (args) => ({
    props: args,
    template:
      '<div style="width:320px;max-width:100%"><jp-breadcrumbs [items]="items" [ariaLabel]="ariaLabel" [maxItems]="maxItems" /></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Show 2 more items' }),
      ).toBeVisible(),
    );
    const trigger = canvas.getByRole('button', { name: 'Show 2 more items' });
    await userEvent.click(trigger);
    const first = canvas.getByRole('menuitem', { name: 'Clubhouse' });
    await expect(first).toHaveFocus();
    await expect(first).toHaveAttribute('href', '#workspace');
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: 'Clubs' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(
      canvas.getByText('Roster notification preferences'),
    ).toHaveAttribute('aria-current', 'page');
  },
};
export const RightToLeft: Story = {
  ...NarrowContainer,
  render: (args) => ({
    props: args,
    template:
      '<div dir="rtl" style="width:320px;max-width:100%"><jp-breadcrumbs [items]="items" [ariaLabel]="ariaLabel" [maxItems]="maxItems" /></div>',
  }),
};
