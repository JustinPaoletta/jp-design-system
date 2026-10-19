import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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

export const NarrowContainer: Story = {
  args: { selectedValue: 'security' },
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div data-tab-container style="inline-size: 18rem; max-inline-size: 100%">${story}</div>`,
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist');
    const security = canvas.getByRole('tab', { name: 'Club access' });
    const visible = async (tab: HTMLElement) => {
      await waitFor(() => {
        const frame = list.getBoundingClientRect();
        const bounds = tab.getBoundingClientRect();
        expect(bounds.left).toBeGreaterThanOrEqual(frame.left - 1);
        expect(bounds.right).toBeLessThanOrEqual(frame.right + 1);
      });
    };
    await expect(security).toHaveAttribute('aria-selected', 'true');
    await visible(security);
    const container = canvasElement.querySelector<HTMLElement>(
      '[data-tab-container]',
    );
    if (!container) throw new Error('Expected a tab container.');
    container.style.inlineSize = '13rem';
    await visible(security);
    const profile = canvas.getByRole('tab', { name: 'Player profile' });
    await userEvent.click(profile);
    await visible(profile);
    await userEvent.keyboard('{End}');
    await expect(profile).toHaveAttribute('aria-selected', 'true');
    await expect(security).toHaveFocus();
    await visible(security);
    await userEvent.keyboard('{Enter}');
    await expect(security).toHaveAttribute('aria-selected', 'true');
    container.style.inlineSize = '18rem';
    await visible(security);
  },
};
