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
    label: 'Featured Game 6 players',
    language: 'TypeScript',
    code: `const lineup = [
  { player: 'Freddy Peralta', position: 'Pitcher' },
  { player: 'Yandy Díaz', position: 'Designated hitter' },
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
    ).toHaveTextContent("'Freddy Peralta'");
  },
};
export const Readonly: Story = { args: { copyable: false } };
export const LiteralMarkup: Story = {
  args: {
    label: 'HTML example',
    language: 'HTML',
    code: '<jp-button>Save game notes</jp-button>',
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('code')).toHaveTextContent(
      '<jp-button>Save game notes</jp-button>',
    );
    await expect(canvasElement.querySelector('pre jp-button')).toBeNull();
  },
};

export const Json: Story = {
  args: {
    label: 'Final game score',
    language: 'JSON',
    code: `{
  "game": "2026 ALCS Game 6",
  "home": { "club": "Rays", "runs": 7 },
  "away": { "club": "Guardians", "runs": 3 },
  "final": true
}`,
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('code .syntax-number'),
    ).toHaveTextContent('7');
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
