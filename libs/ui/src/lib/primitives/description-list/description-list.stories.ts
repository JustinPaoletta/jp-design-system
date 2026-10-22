import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { expect, within } from 'storybook/test';
import { JpCard } from '../card/card';
import { JpDescriptionList } from './description-list';

const meta: Meta<JpDescriptionList> = {
  title: 'Primitives/Data Display/Description List',
  component: JpDescriptionList,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="max-inline-size:32rem;margin:var(--jp-space-lg) auto">${story}</div>`,
    ),
    moduleMetadata({ imports: [JpCard] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    items: [
      { term: 'Manager', description: 'Kevin Cash' },
      { term: 'Series', description: '2026 ALCS' },
      { term: 'Game', description: 'ALCS Game 6' },
      { term: 'Result', description: 'Won' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<jp-card title="Tampa Bay Rays"><jp-description-list [items]="items" /></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpDescriptionList>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        name: 'Tampa Bay Rays',
      }),
    ).toBeVisible();
    await expect(canvasElement.querySelector('dd:last-child')).toBeVisible();
    await expect(
      within(canvasElement).getByText('Won', { selector: 'dd' }),
    ).toBeVisible();
  },
};
export const Plain: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-description-list [items]="items" />`,
  }),
};
export const LongContent: Story = {
  args: {
    items: [
      {
        term: 'Club',
        description: '2026 ALCS winner',
      },
      {
        term: 'Contact',
        description: 'postseason@rays.example',
      },
      {
        term: 'Result',
        description: 'The Rays won and advanced to the World Series.',
      },
    ],
  },
};
