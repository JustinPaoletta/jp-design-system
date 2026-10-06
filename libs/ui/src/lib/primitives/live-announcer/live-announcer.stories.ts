import { Component, inject } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { JpAnnouncer, JpLiveAnnouncer } from './live-announcer';
@Component({
  selector: 'jp-announcer-demo',
  imports: [JpLiveAnnouncer],
  template:
    '<jp-live-announcer /><button type="button" (click)="announce()">Announce save</button>',
})
class AnnouncerDemo {
  private readonly announcer = inject(JpAnnouncer);
  announce() {
    this.announcer.announce('Changes saved');
  }
}
const meta: Meta = {
  title: 'Primitives/Accessibility/Live Announcer',
  decorators: [moduleMetadata({ imports: [AnnouncerDemo] })],
  render: () => ({ template: '<jp-announcer-demo />' }),
};
export default meta;
type Story = StoryObj;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Announce save' }));
    await waitFor(() =>
      expect(c.getByRole('status')).toHaveTextContent('Changes saved'),
    );
  },
};
