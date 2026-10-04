import type { Meta, StoryObj } from '@storybook/angular';

import { JpDrawer } from './drawer';

const meta: Meta<JpDrawer> = {
  title: 'Primitives/Overlays/Drawer',
  component: JpDrawer,
  parameters: { layout: 'padded' },
  args: { title: 'Project details', side: 'end' },
  render: (args) => ({
    props: { ...args, open: false },
    template: `<button type="button" (click)="open=true">Open drawer</button><jp-drawer [title]="title" [open]="open" [side]="side" (openChange)="open=$event"><p>Review the project without leaving the current page.</p><button jpDrawerActions type="button" (click)="open=false">Done</button></jp-drawer>`,
  }),
};
export default meta;
type Story = StoryObj<JpDrawer>;
export const Default: Story = {};
export const BottomSheet: Story = { args: { side: 'bottom' } };
