import { Component } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { provideJpMessages } from '../../i18n';
import { JpPagination } from './pagination';

/** Long Arabic copy in an RTL subtree, so wrapping is visible in a narrow rail. */
@Component({
  selector: 'jp-pagination-rtl-story',
  standalone: true,
  imports: [JpPagination],
  providers: [
    provideJpMessages({
      pagination: {
        label: 'ترقيم صفحات الجدول',
        first: 'الانتقال إلى الصفحة الأولى',
        previous: 'الانتقال إلى الصفحة السابقة',
        next: 'الانتقال إلى الصفحة التالية',
        last: 'الانتقال إلى الصفحة الأخيرة',
        range: ({ start, end, total }) =>
          `عرض السجلات من ${start} إلى ${end} من أصل ${total} سجلًا في هذه المجموعة الطويلة`,
        page: ({ page, pageCount }) =>
          `الصفحة ${page} من أصل ${pageCount} صفحات في هذا التنقل`,
      },
    }),
  ],
  template: `
    <div dir="rtl" lang="ar" style="max-width: 22rem">
      <jp-pagination [page]="1" [pageSize]="10" [total]="42" />
    </div>
  `,
})
class PaginationRtlStory {}

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
export const TranslatedRtl: Story = {
  decorators: [moduleMetadata({ imports: [PaginationRtlStory] })],
  render: () => ({
    template: '<jp-pagination-rtl-story />',
  }),
};
