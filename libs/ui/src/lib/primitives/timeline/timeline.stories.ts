import { GAME_SIX_MOMENTS } from '../game-six.example';
import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { JpCard } from '../card/card';
import { JpTimeline } from './timeline';
const meta: Meta<JpTimeline> = {
  title: 'Primitives/Data Display/Timeline',
  component: JpTimeline,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="max-inline-size:32rem;margin:var(--jp-space-lg) auto">${story}</div>`,
    ),
    moduleMetadata({ imports: [JpCard] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    label: 'The night Tampa Bay clinched',
    emptyText: 'No moments in this collection. Add a Game 6 highlight.',
    events: GAME_SIX_MOMENTS,
  },
  render: (args) => ({
    props: args,
    template: `<jp-card title="The night Tampa Bay clinched"><jp-timeline [label]="label" [events]="events" [emptyText]="emptyText" /></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpTimeline>;
export const Default: Story = {};
export const Empty: Story = {
  args: {
    events: [],
    emptyText: 'No moments in this collection. Add a Game 6 highlight.',
  },
};
export const Plain: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-timeline [label]="label" [events]="events" />`,
  }),
};
