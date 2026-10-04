import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, userEvent } from 'storybook/test';
import { JP_CHIP_SIZES, JpChip, type JpChipSize } from './chip';

type ChipStoryArgs = {
  label: string;
  size: JpChipSize;
  disabled: boolean;
};

@Component({
  selector: 'jp-chip-story-host',
  imports: [JpChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="jp-chip-story-host">
      @for (label of labels(); track label) {
        <jp-chip [label]="label" (removed)="remove(label)" />
      }
    </div>
  `,
  styles: `
    .jp-chip-story-host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--jp-space-sm);
      max-width: 100%;
    }
  `,
})
class ChipStoryHost {
  readonly labels = signal(['Healthy', 'Staging', 'Preview']);

  remove(label: string): void {
    this.labels.update((current) => current.filter((item) => item !== label));
  }
}

const meta: Meta<ChipStoryArgs> = {
  title: 'Primitives/Controls/Chip',
  component: JpChip,
  globals: {
    accent: 'neon',
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    moduleMetadata({
      imports: [JpChip, ChipStoryHost],
    }),
  ],
  argTypes: {
    label: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: JP_CHIP_SIZES,
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Healthy',
    size: 'md',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <jp-chip [label]="label" [size]="size" [disabled]="disabled"></jp-chip>
    `,
  }),
};

export default meta;
type Story = StoryObj<ChipStoryArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    await expect(button?.getAttribute('aria-label')).toBe('Remove Healthy');
    await expect(button?.getAttribute('type')).toBe('button');
  },
};

export const Small: Story = {
  args: { size: 'sm', label: 'Staging' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('jp-chip');
    await expect(host?.classList.contains('jp-chip--sm')).toBe(true);
    await expect(
      canvasElement.querySelector('button')?.getAttribute('aria-label'),
    ).toBe('Remove Staging');
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Preview' },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    await expect(button?.disabled).toBe(true);
    await expect(button?.getAttribute('aria-label')).toBe('Remove Preview');
  },
};

export const LongLabel: Story = {
  args: {
    label: 'Production region with a long filter label that truncates',
  },
};

export const FilterGroup: Story = {
  render: () => ({
    template: `<jp-chip-story-host></jp-chip-story-host>`,
  }),
  play: async ({ canvasElement }) => {
    const before = canvasElement.querySelectorAll('jp-chip');
    await expect(before.length).toBe(3);
    const first = before[0]?.querySelector('button');
    if (!first) {
      throw new Error('Expected a remove button');
    }
    await userEvent.click(first);
    await expect(canvasElement.querySelectorAll('jp-chip').length).toBe(2);
    await expect(
      canvasElement.querySelector('button')?.getAttribute('aria-label'),
    ).toBe('Remove Staging');
  },
};
