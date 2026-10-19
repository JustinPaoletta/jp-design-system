import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpCodeBlock } from './code-block';
const meta: Meta<JpCodeBlock> = {
  title: 'Primitives/Content/Code Block',
  component: JpCodeBlock,
  parameters: { layout: 'padded' },
  args: {
    label: 'Starting lineup',
    language: 'TypeScript',
    code: `const lineup = [
  { player: 'Alex Morgan', position: 'Pitcher' },
  { player: 'Jordan Davis', position: 'Catcher' },
  { player: 'Maya Chen', position: 'Shortstop' },
];

const starters = lineup.map(({ player }) => player);`,
  },
};
export default meta;
type Story = StoryObj<JpCodeBlock>;
export const Default: Story = {};
export const Readonly: Story = { args: { copyable: false } };
export const LiteralMarkup: Story = {
  args: {
    label: 'HTML example',
    language: 'HTML',
    code: '<jp-button>Save lineup</jp-button>',
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('code')).toHaveTextContent(
      '<jp-button>Save lineup</jp-button>',
    );
    await expect(canvasElement.querySelector('pre jp-button')).toBeNull();
  },
};
