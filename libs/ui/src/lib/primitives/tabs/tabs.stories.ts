import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpTabPanel, JpTabs } from './tabs';

const meta: Meta<JpTabs> = {
  title: 'Primitives/Navigation/Tabs',
  component: JpTabs,
  decorators: [moduleMetadata({ imports: [JpTabPanel] })],
  parameters: { layout: 'padded' },
  args: {
    ariaLabel: 'Account settings',
    selectedValue: 'profile',
    tabs: [
      { value: 'profile', label: 'Profile' },
      { value: 'billing', label: 'Billing', disabled: true },
      { value: 'security', label: 'Security' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-tabs [tabs]="tabs" [ariaLabel]="ariaLabel" [(selectedValue)]="selectedValue">
        <ng-template jpTabPanel="profile">
          <p>Profile information</p>
          <label>Display name <input value="Justin" /></label>
        </ng-template>
        <ng-template jpTabPanel="billing"><p>Billing information</p></ng-template>
        <ng-template jpTabPanel="security"><p>Security and authentication</p></ng-template>
      </jp-tabs>
    `,
  }),
};
export default meta;
type Story = StoryObj<JpTabs>;

export const AccountSettings: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const profile = canvas.getByRole('tab', { name: 'Profile' });
    const security = canvas.getByRole('tab', { name: 'Security' });
    await expect(canvas.getByRole('tab', { name: 'Billing' })).toBeDisabled();
    await userEvent.click(profile);
    await userEvent.keyboard('{ArrowRight}');
    await expect(security).toHaveFocus();
    await expect(profile).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(security).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
      'Security and authentication',
    );
  },
};
