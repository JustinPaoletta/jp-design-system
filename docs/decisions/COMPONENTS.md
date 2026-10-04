# Component decisions

Recorded October 4, 2026.

Near-term candidates were ranked against the screens the showcase already renders: shell navigation, the product-recipes filters and settings tab, the data empty states, and the overlays filter popover. A candidate is implemented only when that screen has a real gap and the primitive can be a new standalone component (semantic tokens, OnPush, signals, spec, story, keyboard behavior) without editing frozen components.

| Candidate      | Showcase evidence                                                                                                                                                                                                                 | Decision             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Removable chip | Product recipes renders active filters through `jp-table-toolbar`, which uses a secondary `jp-button`, a visually hidden `Remove filter:` prefix, and a text `×`.                                                                 | Implement `jp-chip`. |
| Disclosure     | Settings are a `jp-tabs` panel (`services` / `settings`). The form is visible. Overlays explain filters in a popover. Nothing hides settings or help behind custom markup.                                                        | Defer.               |
| Link           | Primary navigation is `jp-app-shell-nav-item` (`href` on an inner anchor). Breadcrumbs are anchors. The shell calls `preventDefault` and `router.navigateByUrl` because `routerLink` on the host does not reach the inner anchor. | Defer.               |
| Avatar         | The shell header is the mobile menu toggle. Dashboards show metrics. Account settings is email, region, and support plan. No screen shows a person, initials, or a profile image.                                                 | Defer.               |

## Implemented: chip

`jp-chip` is a removable filter or selection. Status that cannot be removed stays on `jp-badge`.

The product-recipes toolbar cannot adopt it in this pass. `table-toolbar` is an existing component file and is frozen. Consumers can use `jp-chip` for their own filter rows. Replacing the toolbar's internal buttons is follow-up for whoever can edit that file.

### API

| Input or output | Role                                                                           | Default |
| --------------- | ------------------------------------------------------------------------------ | ------- |
| `label`         | Visible text. Required.                                                        | —       |
| `size`          | `sm` or `md`. Invalid values fall back to `md`.                                | `md`    |
| `disabled`      | Blocks click, Delete, and Backspace.                                           | `false` |
| `removed`       | Emitted when the person removes the chip. The consumer updates the collection. | —       |

The remove button's accessible name is `Remove` plus the label (`Remove Healthy`). The visible text remains the label. The icon is decorative. The button type is `button`, so a chip inside a form does not submit.

Long labels truncate with an ellipsis. The remove button stays visible. The full label remains in the accessible name. Lay out a row of chips with wrapping (`jp-inline` or a flex parent with `flex-wrap`). The chip does not implement a `+N` overflow menu.

### Keyboard

- Tab moves to the remove button.
- Enter or Space activates that button.
- Delete or Backspace, while focus is inside the chip, removes it and prevents the browser from navigating back.
- There is no `role="tab"`. A chip is not a tab.

### Focus after removal

If a sibling `jp-chip` under the same parent has an enabled remove button, focus moves to it after removal. The next sibling wins. If that button is disabled, the next enabled sibling is used, then previous siblings.

That move runs only when the target button is still connected. It works when the consumer removes this chip and leaves the sibling in the DOM (`@for` with a stable track key).

Focus is the consumer's responsibility when:

- this chip is the last enabled one
- the parent destroys the sibling in the same update
- the chips are not direct siblings, so no neighbor can be found
- the neighbor's element is replaced and the button captured at removal is no longer connected

In those cases, move focus to a control that remains, such as the search field or `Clear filters`.

### Files

- `libs/ui/src/lib/primitives/chip/chip.ts`
- `libs/ui/src/lib/primitives/chip/chip.html`
- `libs/ui/src/lib/primitives/chip/chip.scss`
- `libs/ui/src/lib/primitives/chip/chip.spec.ts`
- `libs/ui/src/lib/primitives/chip/chip.stories.ts`

### Public export

`libs/ui/src/index.ts` is not edited in this pass. Add this line with the other primitive exports:

```ts
export * from './lib/primitives/chip/chip';
```

## Deferred: disclosure

Settings and help in the showcase are not an accordion gap.

- Product recipes puts account settings in `jp-tabs`. That is peer navigation between Services and Settings. The panel is expanded because the tab is selected. Tabs already implement arrow-key movement and `role="tab"`.
- The settings form (notification email, region, support plan) is short and fully visible.
- Overlays shows "Production, staging, and preview." inside a popover opened from Filters. That is a short explanation, not a disclosure stack.
- No showcase template uses `<details>`, a custom show/hide section, or collapsed help.

Do not add a second tab pattern. A later disclosure, if a screen actually hides settings or help, uses a header button that toggles `aria-expanded` and points at the panel with `aria-controls`. It supports one open panel or several. It does not use `role="tab"`. The heading level of the header stays the consumer's choice so the heading outline stays intact.

## Deferred: link

Defer implementation; consumers use `<a>` with token classes.

A `jp-link` component with an inner anchor would fight `RouterLink`. `jp-app-shell-nav-item` already has that split: the host receives the click, the inner `<a>` receives `href`, and the showcase navigates with `router.navigateByUrl` after `preventDefault`. Putting `routerLink` on a wrapper host does not update the inner anchor.

Button styling does not show a separate need. Navigation uses the shell nav item. Breadcrumbs style their own anchors (underline offset `--jp-space-2xs`, focus ring `--jp-color-focus-ring`). The overlays "Docs" control is a tooltip trigger button, not a navigation link.

Consumers add `routerLink` on a native `<a>`, or project that anchor where content projection is already supported. External destinations set `target="_blank"` and `rel="noopener noreferrer"` on that same `<a>`.

Suggested token classes for a text link. These are consumer CSS, not a shipped stylesheet:

```css
a.jp-link {
  color: var(--jp-color-text-secondary);
  font-family: var(--jp-font-family-base);
  text-underline-offset: var(--jp-space-2xs);
}

a.jp-link:hover {
  color: var(--jp-color-text-primary);
}

a.jp-link:focus-visible {
  outline: 2px solid var(--jp-color-focus-ring);
  outline-offset: 2px;
}
```

```html
<a class="jp-link" routerLink="/data">Data</a> <a class="jp-link" href="https://example.com" target="_blank" rel="noopener noreferrer"> Documentation </a>
```

Long link text wraps with the paragraph. Do not truncate a link in body copy. Focus uses the same 2px ring as buttons.

## Deferred: avatar

No showcase screen asks for an identity mark.

An avatar implemented now would not appear in navigation, the dashboards, or account settings. Those screens do not show initials or an image with a broken-image fallback.

A later avatar, if a screen shows a person, needs: an accessible name input, initials when there is no image, a fallback to those initials when the image fires `error`, and sm/md/lg sizes from size tokens. It must not fetch a profile. The consumer passes the image URL. That work waits for a real identity slot.

## Deferred: later candidates

Date picker, date-range picker, file upload, multi-select, and advanced table features (column visibility, resizing, expandable rows, sticky regions, virtualization) are deferred.

The consumer owns the data, the locale, the time zone, and upload security. No showcase screen requires these controls yet. Pagination, select, combobox, and table remain the current tools, and they keep data ownership in the consumer.

Do not add a date formatter, an upload endpoint, or a virtualized table inside JP to unblock a screen that does not exist.
