# Hierarchy components

`JpTreeView` and `JpTreeTable` are preview APIs. The `/hierarchy` Showcase page
shows both components. Import them from `@jp-design-system/ui`.
When data changes, replace the input arrays.

## Tree view

`JpTreeView` (`jp-tree-view`) must have an `id` and a non-empty accessible `label`.
The `id` must be unique in the document. The component shows a hierarchy with
one keyboard focus position.

| API                                      | Meaning                                                                                                                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nodes: readonly JpTreeNode[]`           | Each node must have a unique, non-empty string `key` and a non-empty `label`. Optional fields are `description`, `disabled` and `children`. Empty or duplicate keys cause an error. |
| `expandedKeys` / `expandedKeysChange`    | The application controls open branches. Keys for hidden children remain in the value.                                                                                               |
| `selection: 'single' \| 'none'`          | The default is `single`. With `none`, the application can handle activation without selection.                                                                                      |
| `selectedKey` / `selectedKeyChange`      | The application controls one selected key. Focus and selection are separate. The application keeps hidden or off-page selections.                                                   |
| `activated: JpTreeNode`                  | Enter or a row click sends the node to the application. The application handles navigation.                                                                                         |
| `state: 'ready' \| 'loading' \| 'error'` | This value sets the root state. Existing nodes can stay visible during a refresh. An empty tree has a name, focus position and status.                                              |
| `loadRequested: JpTreeNode`              | The output sends the node when an unloaded branch opens or its failed request starts again.                                                                                         |
| `retryRequested: void`                   | This output asks the application to repeat a failed root request.                                                                                                                   |
| `disabled`                               | This input stops activation, selection, expansion and retries. Keyboard users can still find disabled nodes. Those nodes have `aria-disabled`.                                      |

### Bind the state

```html
<jp-tree-view id="assets" label="Design assets" [nodes]="assets()" [expandedKeys]="expanded()" (expandedKeysChange)="expanded.set($event)" [selectedKey]="selected()" (selectedKeyChange)="selected.set($event)" (activated)="openAsset($event)" (loadRequested)="loadChildren($event)" />
```

### Keyboard behavior

| Key        | Result                                            |
| ---------- | ------------------------------------------------- |
| Up / Down  | Moves focus to the previous or next visible node. |
| Home / End | Moves focus to the first or last visible node.    |
| Right      | Opens a branch or moves into its first child.     |
| Left       | Closes a branch or moves to its parent.           |
| Enter      | Selects and activates the node.                   |
| Space      | Selects the node without activation.              |
| Tab        | Moves focus outside the tree.                     |

Left and Right reverse in RTL. In `selection="none"`, Enter activates the
node and Space opens or closes a branch. Control, Meta and Alt combinations
stay with the browser.

Letter keys search label prefixes for 700ms. Repeated letters move through
matching labels. Disabled nodes remain in the focus order but cannot act.

The first focus position is the selected visible node or the first root.
Selection does not follow focus. If collapse hides the focused node, focus
returns to the closest visible ancestor. If removal deletes that node, focus
returns to a remaining root. This recovery does not take focus from another
control.

Nested `treeitem` and `group` elements define the hierarchy. Nodes have
explicit levels, sibling positions and sibling counts. Leaves omit
`aria-expanded`. Focus has an outline; selection has a row background.
These rules follow the [W3C tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).

### Lazy branches

1. Set `hasChildren: true` on a branch without loaded children.
2. Set `loadState: 'idle'`, or omit that field.
3. Handle `loadRequested` in the application.
4. Replace the node with a new node that has `loadState: 'loading'`.
5. After success, supply `loadState: 'loaded'` and `children`.
6. After failure, supply `loadState: 'error'`.

The application owns requests, cancellation, response order and the cache.
A loading branch has `aria-busy`. A failed open branch has a retry button;
Enter on the node also starts a retry. The retry button is outside the tree's
Tab order.

A loaded empty branch becomes a leaf. An open branch does not request data
again while its state is `loading`. A retry keeps focus on its node.
The example cancels its timer when Angular destroys the page.

## Tree table

`JpTreeTable` (`jp-tree-table`) must have a unique document `id`, visible `caption`
and `nameHeader`. `JpTreeTableRow` has `key`, `label`, `cells` and optional
nested `children`. Keys and labels must be non-empty. Keys must be unique.

Additional columns use `JpTreeTableColumn[]`. Each column must have a unique `key`
and `header`. Its optional `align` is `start`, `center` or `end`.
Null and undefined cells show an em dash.

The application controls `expandedKeys` and handles `expandedKeysChange`.
A native button opens each branch. It has an accessible label,
`aria-expanded` and child-row references. Collapsed child rows stay in the
DOM with `hidden`. Row headings include the ancestor path. Indentation follows
RTL through logical CSS.

With `selectable`, rows have native checkboxes. `selectedKeys` and
`selectedKeysChange` select rows independently. Parent selection does not
select its children. Hidden and off-page keys remain selected.
Disabled rows stay readable; their buttons and checkboxes are disabled.

The root `state`, `disabled` and `retryRequested` APIs match the tree view.
The table uses a native caption, scoped headers and normal Tab order.
Enter and Space operate buttons and checkboxes. The component does not use
`treegrid` or custom cell-navigation arrows.

The [W3C treegrid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/)
has separate focus and editing rules. The table's scroll region can receive
keyboard focus. Collapse returns focus from a hidden child to its ancestor button.

## Styling, localization and inspection

Both components use existing semantic tokens and inherit accent and density.
Long labels can wrap. Table overflow stays inside the table region.
Forced-colors rules keep selection and focus visible. Disclosure changes have
no animation.

Built-in labels use `JP_MESSAGES.tree`: `empty`, `loading`, `failed`, `retry`,
`expand(label)` and `collapse(label)`. Checkbox labels also use
`JP_MESSAGES.table.selectRow`. The application translates node labels, headings
and cell values.

Prefix search uses the browser's locale-aware lowercase conversion.
It does not remove accents or offer a custom collation policy.

### Limits

These APIs do not include:

- Multiple or cascading tree selection
- Drag movement or tree reordering
- Arbitrary controls inside tree nodes
- Virtualized hierarchy or paged siblings
- Cell editing or a `treegrid` role

The table shows loaded children only. Supply an acyclic, finite tree with
unique keys. Fetch children in the application. Keep deep indentation readable.
Measure large trees before use. Manual accessibility and Windows forced-colors
inspection remain necessary for approval as stable APIs.

## Verification

Unit tests cover hierarchy, keys, keyboard focus, selection, RTL and lazy branches.
Storybook examples cover navigation, retry, expansion and hidden selection.
`hierarchy.spec.ts` covers the Showcase page in Chromium, Firefox and WebKit.
It includes native Enter/Space use, narrow RTL layout and axe scans.
[Verification](qa/VERIFICATION.md) records the results and limits.
