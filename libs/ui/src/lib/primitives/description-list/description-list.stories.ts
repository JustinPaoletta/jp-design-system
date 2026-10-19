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
      { term: 'Coach', description: 'Sam Rivera' },
      { term: 'Home field', description: 'Riverton Field' },
      { term: 'Next game', description: 'October 12 at 18:30' },
      { term: 'Errors last game', description: 0 },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<jp-card title="Riverton Falcons"><jp-description-list [items]="items" /></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpDescriptionList>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { name: 'Riverton Falcons' }),
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
        description: 'Riverton Falcons postseason development squad',
      },
      {
        term: 'Contact',
        description: 'postseason-coordination@falcons.example',
      },
      {
        term: 'Practice location',
        description: 'Riverton Field, north entrance beside the batting cages',
      },
    ],
  },
};
