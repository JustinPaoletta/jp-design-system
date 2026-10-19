import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { JpButton } from '../button/button';

import { JpPageHeader } from './page-header';

const meta: Meta<JpPageHeader> = {
  title: 'Primitives/Layout/Page Header',
  component: JpPageHeader,
  decorators: [moduleMetadata({ imports: [JpButton] })],
  parameters: { layout: 'padded' },
  args: { title: 'Clubs', description: 'Manage clubs and their coaches.' },
  render: (args) => ({
    props: args,
    template: `<jp-page-header [title]="title" [description]="description"><span jpPageMeta>4 clubs</span><jp-button jpPageActions variant="primary">Create club</jp-button></jp-page-header>`,
  }),
};
export default meta;
type Story = StoryObj<JpPageHeader>;
export const Default: Story = {};
