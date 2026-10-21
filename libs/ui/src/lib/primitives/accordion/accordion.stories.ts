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
    template: `<jp-accordion [label]="label" [multiple]="multiple"><jp-disclosure title="Club details" [open]="true">Los Angeles Dodgers. Manager: Dave Roberts. Home field: Dodger Stadium.</jp-disclosure><jp-disclosure title="Game 5" [open]="multiple">October 30, 2024 at Yankee Stadium. First pitch was 8:08 p.m. Jack Flaherty started.</jp-disclosure></jp-accordion>`,
  }),
};
export default meta;
type Story = StoryObj<JpAccordion>;
export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true } };
