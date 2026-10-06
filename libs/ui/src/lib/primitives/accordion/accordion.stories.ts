import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JpAccordion } from './accordion';
import { JpDisclosure } from '../disclosure/disclosure';
const meta: Meta<JpAccordion> = {
  title: 'Primitives/Navigation/Accordion',
  component: JpAccordion,
  parameters: { layout: 'padded' },
  args: { label: 'Project settings' },
  decorators: [moduleMetadata({ imports: [JpDisclosure] })],
  render: (args) => ({
    props: args,
    template: `<jp-accordion [label]="label" [multiple]="multiple"><jp-disclosure title="General">Project name and owner.</jp-disclosure><jp-disclosure title="Advanced">Retries and timeouts.</jp-disclosure></jp-accordion>`,
  }),
};
export default meta;
type Story = StoryObj<JpAccordion>;
export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true } };
