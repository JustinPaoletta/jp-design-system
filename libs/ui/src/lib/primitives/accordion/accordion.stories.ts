import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JpAccordion } from './accordion';
import { JpDisclosure } from '../disclosure/disclosure';
const meta: Meta<JpAccordion> = {
  title: 'Primitives/Navigation/Accordion',
  component: JpAccordion,
  parameters: { layout: 'padded' },
  args: { label: 'Club settings' },
  decorators: [moduleMetadata({ imports: [JpDisclosure] })],
  render: (args) => ({
    props: args,
    template: `<jp-accordion [label]="label" [multiple]="multiple"><jp-disclosure title="Club details" [open]="true">Tampa Bay Rays. The club won ALCS Game 6.</jp-disclosure><jp-disclosure title="ALCS Game 6" [open]="multiple">The Rays won ALCS Game 6 and advanced to the World Series.</jp-disclosure></jp-accordion>`,
  }),
};
export default meta;
type Story = StoryObj<JpAccordion>;
export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true } };
