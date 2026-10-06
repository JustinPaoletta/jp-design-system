# Interaction components (preview)

These components let users reorder one list or view reference cards.
They use existing semantic tokens. They do not add movement animation.
The carousel stays manual by default. Both APIs must have application and manual
accessibility inspection before approval as stable APIs.

Examples are on `/interaction-tools` and in the Reorder and Carousel
Storybook groups.

## Reordering

```ts
import { JpReorder, JpReorderContent, type JpReorderItem } from '@jp-design-system/ui';
```

`jp-reorder` must have a unique document `id`, accessible `label` and
`items: readonly JpReorderItem[]`. Each item must have a unique, non-empty string `id`
and a non-empty `label`. Optional fields are `description` and `disabled`.
Invalid IDs cause an error with recovery instructions.

The `order` model contains item IDs. The component removes unknown and duplicate
IDs. It appends new items in source order. Bind `[order]` with `(orderChange)`,
or use `[(order)]`.

The application saves the order and handles validation and errors.
The example validates saved data and handles denied storage access.
The component does not use storage.

```html
<jp-reorder id="release-priorities" label="Release priorities" [items]="items" [order]="order()" (orderChange)="save($event)">
  <ng-template jpReorderContent let-item let-index="index">
    <strong>{{ index + 1 }}. {{ item.label }}</strong>
  </ng-template>
</jp-reorder>
```

`JpReorderContent` supplies optional item content. Its context gives
`$implicit: JpReorderItem` and `index`. Default content shows the label and
description. The template does not change the handle or action buttons.

### Pointer and touch

1. Drag the numbered handle vertically.
2. Release the handle to save the new order.

Movement below six pixels counts as a click. Pointer capture stays on the
stationary component host. Pointer cancellation or lost capture cancels the draft.

### Keyboard

| Key                           | Result                                         |
| ----------------------------- | ---------------------------------------------- |
| Space / Enter on the handle   | Picks up the item.                             |
| Up / Down                     | Moves the draft one position.                  |
| Home / End                    | Moves the draft to the first or last position. |
| Space / Enter during movement | Saves the draft order.                         |
| Escape                        | Cancels the draft order.                       |

Tab keeps its normal behavior. A visible Cancel button also cancels the draft.

### Move buttons and state

Move up and Move down give the same result without a drag gesture.
Boundary buttons stay focusable with `aria-disabled`. An action that changes
nothing does not emit an order change. These controls follow
[WCAG drag-alternative guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

Pointer and keyboard movement change a local draft until drop.
Cancellation emits no change. Move buttons save changes immediately.
Focus returns to the same item and action, including at a boundary.

An external order change cancels the draft. Removal or disabling of the active
item also cancels it. Disabling the component has the same result.
The latest application state wins.

The native ordered list has a polite, atomic status message.
It announces pickup, position, drop and cancellation. Built-in copy uses
`JP_MESSAGES.reorder`. The application supplies translated item labels and descriptions.

A disabled item cannot start movement. It does not have a fixed position:
other items can move past it.

### Limits

The component supports one vertical list. It does not include cross-list
movement, file drag, grid placement, multiple-item pickup, automatic scroll,
undo history or tree movement.

Keep the target range visible. For a long list, use the move buttons or an
application flow designed for that list.

## Reference-card carousel

```ts
import { JpCarousel, JpCarouselSlide } from '@jp-design-system/ui';
```

`jp-carousel` must have a unique document `id` and accessible `label`.
Project templates with `jpCarouselSlide`. Each key must be unique and non-empty.
An optional slide `label` describes its content. Otherwise, the label gives
the translated slide position and count.

The application owns slide content, selected `index` and controls inside slides.

```html
<jp-carousel id="team-guide" label="Getting started" [index]="index()" (indexChange)="index.set($event)">
  <ng-template jpCarouselSlide="team" label="Invite your team">
    <h2>Invite your team</h2>
    <p>Choose an owner and invite collaborators.</p>
  </ng-template>
  <ng-template jpCarouselSlide="priorities" label="Set priorities">
    <h2>Set priorities</h2>
    <input aria-label="Workspace note" />
  </ng-template>
</jp-carousel>
```

### Selection and keyboard

The model uses a zero-based index. Invalid or out-of-range values show a
bounded position. This adjustment does not change application state during render.
`loop` defaults to `true`. With `false`, Previous and Next stop at the ends.
`disabled` stops navigation and automatic rotation.

Empty and single-slide views hide unnecessary picker and rotation controls.
Native Previous, Next and numbered picker buttons keep focus.
The selected picker has `aria-disabled` and stays in the focus order.

The viewport can receive focus. Left and Right follow LTR or RTL direction.
Home and End select the first or last slide. Keys from controls inside slides
keep their normal behavior.

A horizontal swipe can change the slide. Vertical gestures, short gestures
and pointer cancellation do not change it. Gestures that start on a control
also keep their normal behavior. Buttons give access without gestures.

### Hidden slides and focus

Inactive panels have `hidden` and `inert`. Their content is unavailable for
view, interaction and accessibility navigation. Templates stay in the DOM,
so application input values survive slide changes.

Before a focused slide becomes hidden, focus moves to the viewport.
External index changes use the same protection. The viewport has a 12rem
minimum height and does not clip long content.

The component follows the
[W3C carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).
Built-in labels and role descriptions use `JP_MESSAGES.carousel`.

### Optional rotation

`autoRotate` defaults to `false`. The example leaves it off.
`interval` defaults to 6000ms, with a minimum of 1000ms.
Timers start after browser render. Component destruction removes them.
They do not run on the server.

With rotation enabled, a Pause/Start control comes before slide content.
Hover pauses the timer. Keyboard focus stops rotation until the user starts
it again. Manual navigation also stops rotation.

During rotation, the position live region is off. During manual navigation,
it is polite. `prefers-reduced-motion: reduce` stops rotation and disables Start.
There is no slide animation in either mode. Preference changes update this
behavior. Component destruction removes the listeners.

Without a loop, rotation stops at the final slide.

### Limits and inspection

The component shows one slide and uses grouped picker buttons.
It does not use a tablist. It has no virtualization, media controls, zoom,
lightbox or animated transition.

Use a small set of short reference cards. Use another pattern for long documents,
product grids or required form steps. Automated keyboard, browser, cancellation,
storage and axe tests cover these APIs. Manual screen-reader and Windows
forced-colors inspection remain necessary.
