import type { Meta, StoryObj } from '@storybook/angular';
import { JpFileUpload } from './file-upload';
const file = new File(['Example'], 'release-notes.txt', { type: 'text/plain' });
const meta: Meta<JpFileUpload> = {
  title: 'Primitives/Controls/File Upload',
  component: JpFileUpload,
  parameters: { layout: 'padded' },
  args: {
    label: 'Attachments',
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
      { id: 'one', file, status: 'error', error: 'Connection interrupted' },
    ],
  },
};
export const Complete: Story = {
  args: { items: [{ id: 'one', file, status: 'complete' }] },
};
export const Disabled: Story = { args: { disabled: true } };
