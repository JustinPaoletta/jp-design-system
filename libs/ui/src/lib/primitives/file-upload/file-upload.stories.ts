import { componentWrapperDecorator } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { JpFileUpload } from './file-upload';
const file = new File(
  ['Falcons lineup: Alex Morgan, Jordan Davis, Maya Chen.'],
  'lineup.txt',
  { type: 'text/plain' },
);
const meta: Meta<JpFileUpload> = {
  title: 'Primitives/Controls/File Upload',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 36rem; width: 100%;">${story}</div>`,
    ),
  ],
  component: JpFileUpload,
  parameters: { layout: 'padded' },
  args: {
    label: 'Lineup files',
    accept: '.txt,.md',
    hint: 'Up to three text files, 1 KB each.',
    maxFiles: 3,
    maxBytes: 1024,
    items: [],
  },
};
export default meta;
type Story = StoryObj<JpFileUpload>;
export const Default: Story = {};
export const Ready: Story = {
  args: { items: [{ id: 'one', file, status: 'ready' }] },
};
export const Uploading: Story = {
  args: { items: [{ id: 'one', file, status: 'uploading', progress: 40 }] },
};
export const Failed: Story = {
  args: {
    items: [
      { id: 'one', file, status: 'error', error: 'Score feed interrupted' },
    ],
  },
};
export const Complete: Story = {
  args: { items: [{ id: 'one', file, status: 'complete' }] },
};
export const Disabled: Story = { args: { disabled: true } };
