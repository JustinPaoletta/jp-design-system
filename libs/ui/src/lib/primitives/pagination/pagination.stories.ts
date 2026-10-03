import type { Meta, StoryObj } from '@storybook/angular';
import { JpPagination } from './pagination';
const meta: Meta<JpPagination> = {
  title: 'Primitives/Data Display/Pagination',
  component: JpPagination,
  args: { page: 1, pageSize: 10, total: 42 },
};
export default meta;
type Story = StoryObj<JpPagination>;
export const FirstPage: Story = {};
export const LastPage: Story = { args: { page: 5 } };
export const Empty: Story = { args: { total: 0 } };
export const Fetching: Story = { args: { disabled: true } };
