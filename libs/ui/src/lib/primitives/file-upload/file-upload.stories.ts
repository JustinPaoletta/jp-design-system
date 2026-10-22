import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpButton } from '../button/button';
import { JpCard } from '../card/card';
import {
  JpFileUpload,
  type JpUploadAction,
  type JpUploadItem,
} from './file-upload';

const file = new File(
  ['Rays lineup: Freddy Peralta, Yandy Díaz, Taylor Walls.'],
  'lineup.txt',
  { type: 'text/plain' },
);
interface UploadExampleOptions {
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  maxBytes?: number | null;
  items?: readonly JpUploadItem[];
}
@Component({
  selector: 'jp-upload-example',
  imports: [JpButton, JpCard, JpFileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <jp-card title="Lineup attachments">
      <jp-file-upload
        [label]="options().label ?? 'Lineup files'"
        [hint]="options().hint ?? ''"
        [error]="options().error ?? ''"
        [accept]="options().accept ?? ''"
        [multiple]="options().multiple ?? true"
        [disabled]="options().disabled ?? false"
        [maxFiles]="options().maxFiles ?? 10"
        [maxBytes]="options().maxBytes ?? null"
        [items]="items()"
        (filesSelected)="select($event)"
        (action)="act($event)"
      />
      <div jpCardActions>
        <jp-button
          [disabled]="!hasReady() || options().disabled"
          (click)="uploadReady()"
          >Upload files</jp-button
        >
      </div>
    </jp-card>
  `,
})
class FileUploadExample {
  readonly options = input.required<UploadExampleOptions>();
  readonly items = signal<readonly JpUploadItem[]>([]);
  readonly hasReady = computed(() =>
    this.items().some((item) => item.status === 'ready'),
  );
  private sequence = 0;
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    effect(() => {
      this.clearTimers();
      this.items.set(this.options().items ?? []);
    });
    inject(DestroyRef).onDestroy(() => this.clearTimers());
  }
  private clearTimers(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
  }
  select(files: readonly File[]): void {
    const additions: JpUploadItem[] = files.map((selected) => ({
      id: 'selected-' + ++this.sequence,
      file: selected,
      status: 'ready',
    }));
    this.items.update((items) => [...items, ...additions]);
  }
  uploadReady(): void {
    for (const item of this.items()) {
      if (item.status === 'ready') this.upload(item.id);
    }
  }
  act(action: JpUploadAction): void {
    if (action.type === 'retry') {
      this.upload(action.id);
      return;
    }
    const timer = this.timers.get(action.id);
    if (timer) clearTimeout(timer);
    this.timers.delete(action.id);
    this.items.update((items) => items.filter((item) => item.id !== action.id));
  }
  private upload(id: string): void {
    this.items.update((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status: 'uploading', progress: 40, error: undefined }
          : item,
      ),
    );
    // A user action starts one request. Named preview states stay still.
    const timer = setTimeout(() => {
      this.timers.delete(id);
      this.items.update((items) =>
        items.map((item) =>
          item.id === id
            ? { ...item, status: 'complete', progress: 100 }
            : item,
        ),
      );
    }, 600);
    this.timers.set(id, timer);
  }
}
const meta: Meta<JpFileUpload> = {
  title: 'Primitives/Controls/File Upload',
  decorators: [
    moduleMetadata({ imports: [FileUploadExample] }),
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
  render: (args) => ({
    props: { options: args },
    template: '<jp-upload-example [options]="options" />',
  }),
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
      {
        id: 'one',
        file,
        status: 'error',
        error: 'Could not upload the lineup.',
      },
    ],
  },
};
export const Complete: Story = {
  args: { items: [{ id: 'one', file, status: 'complete' }] },
};
export const Disabled: Story = { args: { disabled: true } };
export const QueueRecovery: Story = {
  args: {
    items: [
      { id: 'ready', file, status: 'ready' },
      {
        id: 'pending',
        file: new File(
          ['Rays 7, Guardians 3. ALCS Game 6, October 19, 2026.'],
          'game-6-notes.txt',
          {
            type: 'text/plain',
          },
        ),
        status: 'uploading',
        progress: 40,
      },
      {
        id: 'failed',
        file: new File(['Rays 7, Guardians 3.'], 'score.txt', {
          type: 'text/plain',
        }),
        status: 'error',
        error: 'Could not upload the score.',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove: lineup.txt' }),
    );
    await expect(canvas.queryByText('lineup.txt')).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Cancel upload: game-6-notes.txt' }),
    );
    await expect(
      canvas.queryByText('game-6-notes.txt'),
    ).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Retry upload: score.txt' }),
    );
    await expect(
      canvas.getByRole('button', { name: 'Cancel upload: score.txt' }),
    ).toBeVisible();
    await expect(
      await canvas.findByRole('button', { name: 'Remove: score.txt' }),
    ).toBeVisible();
    await expect(
      canvas.queryByText('Could not upload the score.'),
    ).not.toBeInTheDocument();
    await userEvent.upload(canvas.getByLabelText('Lineup files'), file);
    await expect(canvas.getByText('lineup.txt')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Upload files' }));
    await expect(
      canvas.getByRole('button', { name: 'Cancel upload: lineup.txt' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Cancel upload: lineup.txt' }),
    );
    await expect(canvas.queryByText('lineup.txt')).not.toBeInTheDocument();
    await userEvent.upload(canvas.getByLabelText('Lineup files'), file);
    await userEvent.click(canvas.getByRole('button', { name: 'Upload files' }));
    await expect(
      await canvas.findByRole('button', { name: 'Remove: lineup.txt' }),
    ).toBeVisible();
    await expect(canvas.getAllByText('Uploaded')).toHaveLength(2);
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};
