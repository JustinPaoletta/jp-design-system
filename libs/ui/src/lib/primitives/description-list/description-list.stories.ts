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
      { term: 'Manager', description: 'Dave Roberts' },
      { term: 'Home field', description: 'Dodger Stadium' },
      { term: 'Game 5', description: 'October 30, 2024 at Yankee Stadium' },
      { term: 'Dodgers errors', description: 0 },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<jp-card title="Los Angeles Dodgers"><jp-description-list [items]="items" /></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpDescriptionList>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        name: 'Los Angeles Dodgers',
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
        description: '2024 World Series champions',
      },
      {
        term: 'Contact',
        description: 'postseason@dodgers.example',
      },
      {
        term: 'Game 5 field',
        description: 'Yankee Stadium, Bronx. First pitch was 8:08 p.m.',
      },
    ],
  },
};
