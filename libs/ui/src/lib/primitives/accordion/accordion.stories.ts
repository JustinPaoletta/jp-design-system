import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JpAccordion } from './accordion';
import { JpDisclosure } from '../disclosure/disclosure';
const meta: Meta<JpAccordion> = {
  title: 'Primitives/Navigation/Accordion',
  component: JpAccordion,
  parameters: { layout: 'padded' },
  args: { label: 'Archive settings' },
  decorators: [moduleMetadata({ imports: [JpDisclosure] })],
  render: (args) => ({
    props: args,
    template: `<jp-accordion [label]="label" [multiple]="multiple"><jp-disclosure title="Game 6 details" [open]="true">Tampa Bay Rays. Manager: Kevin Cash. Home field: Tropicana Field.</jp-disclosure><jp-disclosure title="Game 6" [open]="multiple">October 19, 2026 at Tropicana Field. First pitch was 8:08 p.m. Freddy Peralta started.</jp-disclosure></jp-accordion>`,
  }),
};
export default meta;
type Story = StoryObj<JpAccordion>;
export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true } };
