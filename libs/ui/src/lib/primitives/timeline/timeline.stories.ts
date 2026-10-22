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
    label: 'Game preparation',
    emptyText: 'No game updates yet.',
    events: [
      {
        id: 'lineup',
        title: 'Rays win ALCS Game 6',
        timeLabel: 'ALCS Game 6',
        dateTime: '2024-10-30',
        description: 'The Rays won ALCS Game 6.',
      },
      {
        id: 'first-pitch',
        title: 'Club update',
        timeLabel: 'ALCS Game 6',
        dateTime: '2024-10-30T20:08:00-04:00',
        description: 'ALCS Game 6 is final.',
      },
      {
        id: 'final',
        title: 'Final',
        timeLabel: 'World Series berth',
        dateTime: '2024-10-30T23:50:00-04:00',
        description:
          'The Rays won ALCS Game 6 and advanced to the World Series.',
      },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<jp-card title="Game preparation"><jp-timeline [label]="label" [events]="events" [emptyText]="emptyText" /></jp-card>`,
  }),
};
export default meta;
type Story = StoryObj<JpTimeline>;
export const Default: Story = {};
export const Empty: Story = {
  args: { events: [], emptyText: 'No game updates yet.' },
};
export const Plain: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-timeline [label]="label" [events]="events" />`,
  }),
};
