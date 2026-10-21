import type { Meta, StoryObj } from '@storybook/angular';

import { JpDrawer } from './drawer';
import { moduleMetadata } from '@storybook/angular';
import { JpButton } from '../button/button';

const meta: Meta<JpDrawer> = {
  title: 'Primitives/Overlays/Drawer',
  component: JpDrawer,
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [JpButton] })],
  args: { title: 'Club details', side: 'end', open: true },
  render: (args) => ({
    props: args,
    template: `<jp-button variant="secondary" (click)="open=true">Open drawer</jp-button><jp-drawer [title]="title" [open]="open" [side]="side" (openChange)="open=$event"><p>Review the club roster without leaving this page.</p><jp-button jpDrawerActions (click)="open=false">Done</jp-button></jp-drawer>`,
  }),
};
export default meta;
type Story = StoryObj<JpDrawer>;
export const Default: Story = {};
export const BottomSheet: Story = {
  args: { side: 'bottom' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
