import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { JP_TOOLTIP_PLACEMENTS } from '../shared/primitive-types';
import { JpButton } from '../button/button';
import { JpTooltip } from './tooltip';

const meta: Meta<JpTooltip> = {
  title: 'Primitives/Feedback/Tooltip',
  component: JpTooltip,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: JP_TOOLTIP_PLACEMENTS,
    },
  },
  args: {
    content: 'Copy deployment ID',
    placement: 'top',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [JpTooltip, JpButton],
    },
    template: `
      <jp-tooltip [content]="content" [placement]="placement">
        <jp-button variant="secondary" type="button">Hover me</jp-button>
      </jp-tooltip>
    `,
  }),
};

export default meta;
type Story = StoryObj<JpTooltip>;

export const Top: Story = {};

export const TopInteractive: Story = {
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-tooltip') as HTMLElement;
    await userEvent.hover(host);
    await expect(host.classList.contains('jp-tooltip--open')).toBe(true);
    await expect(host.querySelector('[role="tooltip"]')?.textContent).toContain(
      'Copy deployment ID',
    );
  },
};

export const Bottom: Story = {
  args: { placement: 'bottom' },
};

export const Left: Story = {
  args: { placement: 'left' },
};

export const Right: Story = {
  args: { placement: 'right' },
};
