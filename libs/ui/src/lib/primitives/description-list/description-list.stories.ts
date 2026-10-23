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
      { term: 'Home field', description: 'Tropicana Field' },
      { term: 'Game 6', description: 'October 19, 2026 at Tropicana Field' },
      { term: 'Rays errors', description: 0 },
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
      within(canvasElement).getByText('0', { selector: 'dd' }),
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
        description: '2026 American League champions',
      },
      {
        term: 'Contact',
        description: 'archive@rays.example',
      },
      {
        term: 'Game 6 field',
        description:
          'Tropicana Field, St. Petersburg. First pitch was 8:08 p.m.',
      },
    ],
  },
};
