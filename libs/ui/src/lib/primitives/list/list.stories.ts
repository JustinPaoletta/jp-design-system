import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

import { JpList, JpListItemTemplate } from './list';
import { JpBadge } from '../badge/badge';
import { JpAvatar } from '../avatar/avatar';

const meta: Meta<JpList> = {
  title: 'Primitives/Data Display/List',
  component: JpList,
  decorators: [
    moduleMetadata({ imports: [JpListItemTemplate, JpBadge, JpAvatar] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    items: [
      {
        id: 'a',
        title: 'Alex Morgan',
        description: 'Varsity',
        meta: 'Available',
      },
      {
        id: 'b',
        title: 'Jordan Davis',
        description: 'Varsity',
        meta: 'Day to day',
      },
    ],
  },
};
export default meta;
type Story = StoryObj<JpList>;
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<jp-list [items]="items" style="max-width:36rem"><ng-template jpListItem let-player><div style="display:flex;align-items:center;gap:var(--jp-space-md)"><jp-avatar [name]="player.title" /><div><strong>{{player.title}}</strong><p style="margin:var(--jp-space-2xs) 0 0;color:var(--jp-color-text-secondary);font-size:var(--jp-font-size-caption)">{{player.description}}</p></div></div><jp-badge [tone]="player.meta === 'Available' ? 'success' : 'warning'">{{player.meta}}</jp-badge></ng-template></jp-list>`,
  }),
};
