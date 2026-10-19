import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { JpList, JpListItemTemplate } from './list';
import { JpBadge } from '../badge/badge';
import { JpAvatar } from '../avatar/avatar';
import { JpCard } from '../card/card';

const meta: Meta<JpList> = {
  title: 'Primitives/Data Display/List',
  component: JpList,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="max-inline-size:32rem;margin:var(--jp-space-lg) auto">${story}</div>`,
    ),
    moduleMetadata({
      imports: [JpListItemTemplate, JpBadge, JpAvatar, JpCard],
    }),
  ],
  parameters: { layout: 'padded' },
  args: {
    items: [
      {
        id: 'a',
        title: 'Jack Flaherty',
        description: 'Pitcher · Active roster',
        meta: 'Available',
      },
      {
        id: 'b',
        title: 'Freddie Freeman',
        description: 'First base · Active roster',
        meta: 'Day to day',
      },
      {
        id: 'c',
        title: 'Tommy Edman',
        description: 'Shortstop · Active roster',
        meta: 'Available',
      },
    ],
  },
};
export default meta;
type Story = StoryObj<JpList>;
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-card title="Player availability">
      <jp-list [items]="items">
        <ng-template jpListItem let-player>
          <div style="display:flex;align-items:center;gap:var(--jp-space-sm);min-inline-size:0;flex:1 1 9rem">
            <jp-avatar [name]="player.title" style="flex-shrink:0" />
            <div style="min-inline-size:0;overflow-wrap:anywhere">
              <strong style="font-size:var(--jp-font-size-body-sm);font-weight:var(--jp-font-weight-medium)">{{player.title}}</strong>
              <p style="margin:var(--jp-space-2xs) 0 0;color:var(--jp-color-text-secondary);font-size:var(--jp-font-size-caption)">{{player.description}}</p>
            </div>
          </div>
          <jp-badge [tone]="player.meta === 'Available' ? 'success' : 'warning'" size="sm">{{player.meta}}</jp-badge>
        </ng-template>
      </jp-list>
    </jp-card>`,
  }),
};
export const Plain: Story = {};
