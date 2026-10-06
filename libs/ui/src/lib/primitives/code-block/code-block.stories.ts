import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpCodeBlock } from './code-block';
const meta: Meta<JpCodeBlock> = {
  title: 'Primitives/Content/Code Block',
  component: JpCodeBlock,
  parameters: { layout: 'padded' },
  args: {
    label: 'Install the packages',
    language: 'Shell',
    code: 'npm install @jp-design-system/ui @jp-design-system/tokens',
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
    code: '<jp-button>Save changes</jp-button>',
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('code')).toHaveTextContent(
      '<jp-button>Save changes</jp-button>',
    );
    await expect(canvasElement.querySelector('pre jp-button')).toBeNull();
  },
};
