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
        title: 'Starting lineup confirmed',
        timeLabel: 'October 12 · 17:30',
        dateTime: '2026-10-12T17:30:00-04:00',
        description: 'Sam Rivera named Alex Morgan as starting pitcher.',
      },
      {
        id: 'warmup',
        title: 'Warmup completed',
        timeLabel: 'October 12 · 18:15',
        dateTime: '2026-10-12T18:15:00-04:00',
        description: 'The Falcons are ready at Riverton Field.',
      },
      {
        id: 'first-pitch',
        title: 'First pitch',
        timeLabel: 'October 12 · 18:30',
        dateTime: '2026-10-12T18:30:00-04:00',
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
