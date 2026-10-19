import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpTabPanel, JpTabs } from './tabs';
import { JpInput } from '../input/input';

const meta: Meta<JpTabs> = {
  title: 'Primitives/Navigation/Tabs',
  component: JpTabs,
  decorators: [moduleMetadata({ imports: [JpTabPanel, JpInput] })],
  parameters: { layout: 'padded' },
  args: {
    ariaLabel: 'Club account',
    selectedValue: 'profile',
    tabs: [
      { value: 'profile', label: 'Player profile' },
      { value: 'billing', label: 'Club dues', disabled: true },
      { value: 'security', label: 'Club access' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-tabs [tabs]="tabs" [ariaLabel]="ariaLabel" [(selectedValue)]="selectedValue">
        <ng-template jpTabPanel="profile">
          <p>Player profile information</p>
          <jp-input label="Player name" placeholder="Alex Morgan" />
        </ng-template>
        <ng-template jpTabPanel="billing"><p>Club dues information</p></ng-template>
        <ng-template jpTabPanel="security"><p>Club access and sign-in</p></ng-template>
      </jp-tabs>
    `,
  }),
};
export default meta;
type Story = StoryObj<JpTabs>;

export const AccountSettings: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const profile = canvas.getByRole('tab', { name: 'Player profile' });
    const security = canvas.getByRole('tab', { name: 'Club access' });
    await expect(canvas.getByRole('tab', { name: 'Club dues' })).toBeDisabled();
    await userEvent.click(profile);
    await userEvent.keyboard('{ArrowRight}');
    await expect(security).toHaveFocus();
    await expect(profile).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(security).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
      'Club access and sign-in',
    );
  },
};
