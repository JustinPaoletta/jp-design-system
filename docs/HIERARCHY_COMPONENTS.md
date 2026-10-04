# Hierarchy components (preview)

The hierarchy package supplies a selection/activation tree and a native data table with nested rows. The `/hierarchy` showcase is an asset browser and project breakdown. Both components use immutable input data, stable keys and consumer-owned state. They introduce no entrance, resizing or disclosure animation.

## Tree view

`JpTreeView` (`jp-tree-view`) requires a document-unique `id` and a nonempty accessible `label`.

| Input/output                             | Contract                                                                                                                                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nodes: readonly JpTreeNode[]`           | Each node has a nonempty globally unique string `key`, a nonempty `label`, optional `description`, `disabled`, and recursive `children`. Duplicate/empty keys fail immediately instead of rendering conflicting IDs. |
| `expandedKeys` / `expandedKeysChange`    | Controlled expansion. Hidden descendant expansion keys survive collapse.                                                                                                                                             |
| `selection: 'single' \| 'none'`          | Single selection by default. `none` is an activation-only contract for a consumer handling navigation.                                                                                                               |
| `selectedKey` / `selectedKeyChange`      | Controlled single selection, independent of keyboard focus. Invisible/off-page selection is retained by the consumer.                                                                                                |
| `activated: JpTreeNode`                  | Enter or row click asks the consumer to open the item. The component does not navigate, fetch, or own a router.                                                                                                      |
| `state: 'ready' \| 'loading' \| 'error'` | Root state; existing data can remain visible during refresh. Empty data has a focusable named tree and localized status.                                                                                             |
| `loadRequested: JpTreeNode`              | Emitted when an unloaded branch opens, or its failed request is retried.                                                                                                                                             |
| `retryRequested: void`                   | Requests retry for a root error.                                                                                                                                                                                     |
| `disabled`                               | Prevents activation, selection, expansion and retry. Nodes remain keyboard discoverable with `aria-disabled`.                                                                                                        |

Example controlled bindings:

```html
<jp-tree-view id="assets" label="Design assets" [nodes]="assets()" [expandedKeys]="expanded()" (expandedKeysChange)="expanded.set($event)" [selectedKey]="selected()" (selectedKeyChange)="selected.set($event)" (activated)="openAsset($event)" (loadRequested)="loadChildren($event)" />
```

Arrow Up/Down, Home/End and a 700 ms prefix search move focus among visible nodes. Repeated letters cycle through matching labels. Arrow Right opens a branch or enters its first child; Arrow Left closes it or returns to its parent. These horizontal directions reverse in RTL. Enter selects and activates; Space selects without activating. In activation-only mode, Enter activates and Space toggles a branch. Tab exits the tree. Control, Meta and Alt shortcuts are left to the browser. Disabled nodes remain discoverable but cannot act.

The roving tab stop initially uses the selected visible node, otherwise the first root. Selection does not follow focus. A focused descendant hidden by an external collapse returns to its closest surviving ancestor; removing the focused node recovers to a surviving root. Recovery does not move focus back from another control.

Semantic ownership uses nested `treeitem` and `group` elements, explicit levels, sibling positions and counts. Leaf nodes omit `aria-expanded`. The visible focus outline differs from the selected row background. These behaviors are informed by the [W3C APG tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).

### Lazy branches

Set `hasChildren: true` and `loadState: 'idle'` (or omit state) on an unloaded branch. Handle `loadRequested` by immutably replacing that node with `loadState: 'loading'`, then either `loadState: 'loaded', children: [...]` or `loadState: 'error'`. The consumer owns requests, cancellation, stale-response protection and cache policy. Loading branches carry `aria-busy`; failed expanded branches offer a pointer retry control and Enter on the node retries. The retry control stays out of the roving Tab order. A loaded empty child list becomes a leaf.

Repeated opening while the consumer marks a node loading does not request again. A retry keeps its node focused. The showcase demonstrates request failure followed by a successful retry and cancels its demonstration timer when destroyed.

## Tree table

`JpTreeTable` (`jp-tree-table`) requires document-unique `id`, visible `caption`, and consumer-provided `nameHeader`. Rows are `JpTreeTableRow`: the same stable `key`/`label` hierarchy, a `cells` record, and recursive row children. Additional columns are `JpTreeTableColumn[]` with unique `key`, `header`, and optional `align: 'start' | 'center' | 'end'`. Null/undefined cell values display an em dash.

Expansion uses `expandedKeys`/`expandedKeysChange`. Each branch is a native button with an accessible expand/collapse label, `aria-expanded` and references to its child row IDs. Descendants remain in the DOM with `hidden` when an ancestor collapses. Row headings include their ancestor path for readers; indentation uses logical padding in RTL.

Optional `selectable` enables native checkboxes. `selectedKeys`/`selectedKeysChange` select each row independently; selecting a parent does not select descendants. Hidden and off-page keys are preserved. Disabled rows remain readable with disabled buttons/checkboxes. `state`, `disabled` and `retryRequested` match the tree's root-state contract.

This is a **native HTML table**, using caption, scoped headers and normal Tab order. Enter/Space operate its buttons and checkboxes. It does not set a `treegrid` role or intercept cell-navigation arrows. A hierarchical grid requires a separate focus and editing contract; see the [W3C treegrid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/) for that interaction distinction. The table scroll region can receive focus to allow keyboard scrolling. Collapsing a focused descendant restores its ancestor disclosure focus.

## Styling, localization and review

Both components use existing semantic surface, border, text, focus, spacing, control-size and typography tokens. They inherit accent and density, use logical geometry, support long labels and contain table overflow on narrow screens. Forced-colors styles provide explicit selected/focused boundaries. They use static disclosure changes and need no reduced-motion override.

Built-in status and expand/collapse copy comes from `JP_MESSAGES.tree` (`empty`, `loading`, `failed`, `retry`, `expand(label)`, `collapse(label)`). Table checkbox labels reuse `JP_MESSAGES.table.selectRow`. Consumer node labels, headings and table values must already be localized. Typeahead uses browser locale casing and matches label prefixes; it does not provide accent folding or a customizable collation policy.

Preview limits: no multi-selection tree, cascade selection, drag/reordering, arbitrary interactive node templates, virtualized hierarchy, paged siblings, cell editing or treegrid role. The native tree table displays loaded children only; fetch children in the consumer before supplying them. Consumers must supply a finite acyclic tree and unique IDs/keys. Preserve meaningful labels and avoid unbounded indentation on extremely deep structures. Large trees should be measured before choosing a future virtualization contract. Manual assistive-technology and forced-colors review remain part of promotion.

## Verification

Scoped unit tests cover semantic ownership, stable-key rejection, focus separate from selection, keyboard and RTL navigation, typeahead, controlled expansion, focus recovery, lazy request/retry, translated states and independent native table selection. Storybook play stories cover asset navigation, lazy retry, RTL expansion and hidden table selection. Browser specs in `hierarchy.spec.ts` exercise the consumer in Chromium/WebKit, including native Enter/Space behavior, narrow RTL layout and automated accessibility; integrated execution is recorded by the release/QA pass.
