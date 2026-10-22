import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpCodeBlock } from './code-block';
const meta: Meta<JpCodeBlock> = {
  title: 'Primitives/Content/Code Block',
  component: JpCodeBlock,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="max-inline-size:48rem;margin:var(--jp-space-lg) auto">${story}</div>`,
    ),
  ],
  parameters: { layout: 'padded' },
  args: {
    label: 'Starting lineup',
    language: 'TypeScript',
    code: `const lineup = [
  { player: 'Shane Baz', position: 'Pitcher' },
  { player: 'Yandy Díaz', position: 'First base' },
  { player: 'Taylor Walls', position: 'Shortstop' },
];

const starters = lineup.map(({ player }) => player);`,
  },
};
export default meta;
type Story = StoryObj<JpCodeBlock>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('code .syntax-keyword'),
    ).toHaveTextContent('const');
    await expect(
      canvasElement.querySelector('code .syntax-string'),
    ).toHaveTextContent("'Shane Baz'");
  },
};
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

export const Json: Story = {
  args: {
    label: 'ALCS Game 6 result',
    language: 'JSON',
    code: `{
  "game": "ALCS Game 6",
  "club": "Rays",
  "result": "won",
  "gameNumber": 6,
  "final": true
}`,
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('code .syntax-number'),
    ).toHaveTextContent('6');
    await expect(
      canvasElement.querySelector('code .syntax-keyword'),
    ).toHaveTextContent('true');
  },
};
export const PlainText: Story = {
  args: { highlight: false },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('code span')).toHaveLength(1);
    await expect(
      canvasElement.querySelector('code .syntax-keyword'),
    ).toBeNull();
    await expect(canvasElement.querySelector('code')).toHaveTextContent(
      'const starters',
    );
  },
};
