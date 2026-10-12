import type { Meta, StoryObj } from '@storybook/angular';

import { JpPageHeader } from './page-header';

const meta: Meta<JpPageHeader> = {
  title: 'Primitives/Layout/Page Header',
  component: JpPageHeader,
  parameters: { layout: 'padded' },
  args: { title: 'Clubs', description: 'Manage clubs and their coaches.' },
  render: (args) => ({
    props: args,
    template: `<jp-page-header [title]="title" [description]="description"><span jpPageMeta>4 clubs</span><button jpPageActions type="button">Create club</button></jp-page-header>`,
  }),
};
export default meta;
type Story = StoryObj<JpPageHeader>;
export const Default: Story = {};
