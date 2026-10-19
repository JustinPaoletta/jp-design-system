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
        title: 'Jack Flaherty starts',
        timeLabel: 'October 30, 2024',
        dateTime: '2024-10-30',
        description: 'Dave Roberts started Jack Flaherty in Game 5.',
      },
      {
        id: 'first-pitch',
        title: 'First pitch',
        timeLabel: 'October 30 · 8:08 p.m.',
        dateTime: '2024-10-30T20:08:00-04:00',
        description: 'Game 5 begins at Yankee Stadium.',
      },
      {
        id: 'final',
        title: 'Final',
        timeLabel: 'October 30 · 11:50 p.m.',
        dateTime: '2024-10-30T23:50:00-04:00',
        description: 'Dodgers 7, Yankees 6. The series ends 4 games to 1.',
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
