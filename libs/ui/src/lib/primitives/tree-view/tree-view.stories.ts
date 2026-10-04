import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { JpTreeView, type JpTreeNode, type JpTreeSelection } from './tree-view';

const assets: readonly JpTreeNode[] = [
  {
    key: 'brand',
    label: 'Brand assets',
    children: [
      {
        key: 'logos',
        label: 'Logos',
        children: [
          { key: 'wordmark', label: 'Wordmark.svg' },
          { key: 'symbol', label: 'Symbol.svg' },
        ],
      },
      { key: 'type', label: 'Typography.pdf' },
    ],
  },
  {
    key: 'product',
    label: 'Product assets',
    children: [{ key: 'icons', label: 'Icons.svg' }],
  },
  {
    key: 'shared',
    label: 'Shared library',
    hasChildren: true,
    loadState: 'idle',
  },
  { key: 'archived', label: 'Archived assets', disabled: true },
];
@Component({
  selector: 'jp-tree-story',
  imports: [JpTreeView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <jp-tree-view
      id="story-assets"
      label="Design assets"
      [nodes]="nodes()"
      [disabled]="disabled()"
      [selection]="selection()"
      [expandedKeys]="expanded()"
      (expandedKeysChange)="expanded.set($event)"
      [selectedKey]="selected()"
      (selectedKeyChange)="selected.set($event)"
      (activated)="opened.set($event.label)"
      (loadRequested)="load($event)"
    />
    <p role="status">
      Selected: {{ selected() || 'none' }}. Opened: {{ opened() || 'none' }}.
    </p>
  `,
})
class TreeStory {
  readonly disabled = input(false);
  readonly selection = input<JpTreeSelection>('single');
  readonly nodes = signal(assets);
  readonly expanded = signal<string[]>(['brand']);
  readonly selected = signal<string | null>(null);
  readonly opened = signal('');
  private attempts = 0;
  load(node: JpTreeNode): void {
    this.attempts += 1;
    this.nodes.update((nodes) =>
      nodes.map((value) =>
        value.key === node.key
          ? {
              ...value,
              loadState: this.attempts === 1 ? 'error' : 'loaded',
              children:
                this.attempts === 1
                  ? undefined
                  : [{ key: 'guidelines', label: 'Guidelines.pdf' }],
            }
          : value,
      ),
    );
  }
}
const meta: Meta<JpTreeView> = {
  title: 'Primitives/Navigation/Tree View',
  component: JpTreeView,
  decorators: [moduleMetadata({ imports: [TreeStory] })],
  parameters: { layout: 'padded' },
  args: { id: 'tree-states', label: 'Design assets', nodes: assets },
};
export default meta;
type Story = StoryObj<JpTreeView>;
export const AssetBrowser: Story = {
  render: () => ({ template: '<jp-tree-story />' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const brand = canvas.getByRole('treeitem', { name: 'Brand assets' });
    brand.focus();
    await userEvent.keyboard('{ArrowDown}');
    const logos = canvas.getByRole('treeitem', { name: 'Logos' });
    await expect(logos).toHaveFocus();
    await expect(logos).toHaveAttribute('aria-selected', 'false');
    await userEvent.keyboard('{ArrowRight}{ArrowRight} ');
    const wordmark = canvas.getByRole('treeitem', { name: 'Wordmark.svg' });
    await expect(wordmark).toHaveFocus();
    await expect(wordmark).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Opened: Wordmark.svg',
    );
  },
};
export const LazyRetry: Story = {
  render: () => ({ template: '<jp-tree-story />' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const library = canvas.getByRole('treeitem', { name: 'Shared library' });
    library.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(
      canvas.getByRole('button', { name: 'Retry: Shared library' }),
    ).toBeVisible();
    await userEvent.keyboard('{Enter}{ArrowRight}');
    await expect(
      canvas.getByRole('treeitem', { name: 'Guidelines.pdf' }),
    ).toHaveFocus();
  },
};
export const ActivationOnly: Story = {
  render: () => ({ template: '<jp-tree-story selection="none" />' }),
};
export const Disabled: Story = {
  render: () => ({ template: '<jp-tree-story [disabled]="true" />' }),
};
export const Empty: Story = { args: { nodes: [] } };
export const Loading: Story = { args: { nodes: [], state: 'loading' } };
export const Error: Story = { args: { nodes: [], state: 'error' } };
export const RightToLeft: Story = {
  render: () => ({ template: '<div dir="rtl"><jp-tree-story /></div>' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const product = canvas.getByRole('treeitem', { name: 'Product assets' });
    product.focus();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(
      canvas.getByRole('treeitem', { name: 'Icons.svg' }),
    ).toHaveFocus();
  },
};
