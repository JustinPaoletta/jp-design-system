import { Component, inject, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { JpAnnouncer, JpLiveAnnouncer } from './live-announcer';
import { JpButton } from '../button/button';
import { JpText } from '../text/text';
@Component({
  selector: 'jp-announcer-demo',
  imports: [JpLiveAnnouncer, JpButton, JpText],
  template:
    '<jp-live-announcer /><jp-button variant="secondary" (click)="announce()">Announce lineup save</jp-button>@if (saved()) { <p><jp-text>Game notes saved</jp-text></p> }',
})
class AnnouncerDemo {
  private readonly announcer = inject(JpAnnouncer);
  readonly saved = signal(false);
  announce() {
    this.saved.set(true);
    this.announcer.announce('Game notes saved');
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
    await userEvent.click(
      c.getByRole('button', { name: 'Announce lineup save' }),
    );
    await waitFor(() =>
      expect(c.getByRole('status')).toHaveTextContent('Game notes saved'),
    );
  },
};
