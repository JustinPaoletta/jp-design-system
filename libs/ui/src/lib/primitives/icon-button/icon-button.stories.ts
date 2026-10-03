import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JP_BUTTON_TYPES, JP_CONTROL_SIZES } from '../shared/primitive-types';
import { JpIconButton } from './icon-button';

const meta: Meta<JpIconButton> = {
  title: 'Primitives/Controls/Icon Button',
  component: JpIconButton,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: JP_CONTROL_SIZES,
    },
    type: {
      control: 'select',
      options: JP_BUTTON_TYPES,
    },
    disabled: {
      control: 'boolean',
    },
    ariaLabel: {
      control: 'text',
    },
  },
  args: {
    ariaLabel: 'Collapse sidebar',
    size: 'md',
    type: 'button',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-icon-button
        [ariaLabel]="ariaLabel"
        [size]="size"
        [type]="type"
        [disabled]="disabled"
      >
        <svg viewBox="0 0 16 16" width="100%" height="100%" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 3h2v10H3V3zm4 0h6v2H7V3zm0 4h6v2H7V7zm0 4h6v2H7v-2z"
          />
        </svg>
      </jp-icon-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<JpIconButton>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    await expect(button?.getAttribute('aria-label')).toBe('Collapse sidebar');
  },
};

const iconSvg = `
  <svg viewBox="0 0 16 16" width="100%" height="100%" aria-hidden="true">
    <path
      fill="currentColor"
      d="M3 3h2v10H3V3zm4 0h6v2H7V3zm0 4h6v2H7V7zm0 4h6v2H7v-2z"
    />
  </svg>
`;

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:1rem;">
        <jp-icon-button ariaLabel="Small action" size="sm">${iconSvg}</jp-icon-button>
        <jp-icon-button ariaLabel="Medium action" size="md">${iconSvg}</jp-icon-button>
        <jp-icon-button ariaLabel="Large action" size="lg">${iconSvg}</jp-icon-button>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('jp-icon-button');
    await expect(buttons.length).toBe(3);
    await expect(buttons[0].classList.contains('jp-icon-button--sm')).toBe(
      true,
    );
    await expect(buttons[2].classList.contains('jp-icon-button--lg')).toBe(
      true,
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    await expect(button?.disabled).toBe(true);
    await expect(button?.getAttribute('aria-label')).toBe('Collapse sidebar');
  },
};
