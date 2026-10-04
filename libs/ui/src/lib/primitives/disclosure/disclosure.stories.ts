import type { Meta, StoryObj } from '@storybook/angular';

import { JpDisclosure } from './disclosure';

const meta: Meta<JpDisclosure> = {
  title: 'Primitives/Navigation/Disclosure',
  component: JpDisclosure,
  parameters: { layout: 'padded' },
  args: { title: 'Advanced settings' },
  render: (args) => ({
    props: args,
    template: `<jp-disclosure [title]="title" [open]="open" (openChange)="open=$event">Configure retries and timeouts.</jp-disclosure>`,
  }),
};
export default meta;
type Story = StoryObj<JpDisclosure>;
export const Default: Story = {};
export const Expanded: Story = { args: { open: true } };
