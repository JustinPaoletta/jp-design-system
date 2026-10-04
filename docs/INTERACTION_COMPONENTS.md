# Interaction components (preview)

The interaction tools support two concrete workflows: reorder release priorities in a single list, and browse a short onboarding/reference-card guide. Both use existing semantic color, typography, space, radius, and focus tokens. Neither adds animation; the carousel is manual by default. All new APIs remain preview until consumer and assistive-technology review.

See the `/interaction-tools` showcase route and the **Reorder** and **Carousel** Storybook groups.

## Reordering

```ts
import { JpReorder, JpReorderContent, type JpReorderItem } from '@jp-design-system/ui';
```

`jp-reorder` accepts a required document-unique `id`, accessible `label`, and `items: readonly JpReorderItem[]`. Each item has a non-empty unique `id`, `label`, optional `description`, and optional `disabled`. Invalid item identity throws an actionable error rather than silently reusing the wrong DOM node.

The `order` model accepts an array of ids. Unknown/duplicate ids are removed and new items append in source order. Bind `[order]` and `(orderChange)`, or use `[(order)]`. The consumer owns persistence, validation, saving, and errors. The demonstration validates persisted data and catches denied storage; the primitive never accesses storage.

```html
<jp-reorder id="release-priorities" label="Release priorities" [items]="items" [order]="order()" (orderChange)="save($event)">
  <ng-template jpReorderContent let-item let-index="index">
    <strong>{{ index + 1 }}. {{ item.label }}</strong>
  </ng-template>
</jp-reorder>
```

`JpReorderContent` is optional. Its typed context exposes `$implicit: JpReorderItem` and `index`; default content renders the label and description. It does not change handle or action-button semantics.

- **Pointer/touch:** drag the numbered handle vertically. A six-pixel threshold separates a click from a drag; pointer capture stays on the unmoving component host. Pointer cancellation or lost capture restores the draft.
- **Keyboard:** activate the handle with Space or Enter to pick up; Up/Down move one place, Home/End move to bounds; Space/Enter drop and Escape cancels. Normal Tab behavior remains intact. A visible Cancel button also cancels.
- **Click alternative:** explicit Move up/Move down buttons perform the same changes without dragging. Boundary buttons remain focusable with `aria-disabled`; no-op actions emit no order change. This supplies a single-pointer alternative alongside the keyboard path, following [WCAG 2.2 dragging-movements guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).
- **Commit contract:** pointer and keyboard movement changes only a local draft until drop. Escape/cancellation emits nothing. Click alternatives commit immediately. Focus returns to the same stable item/action after movement, including boundary positions.
- **External changes:** changed committed order, removed/disabled active items, or a disabled component cancel an active draft. The consumer's newest state wins.

The list uses native ordered-list semantics. A polite atomic status announces pickup, position, drop, and cancellation. Built-in copy comes from `JP_MESSAGES.reorder`; supplied item labels and descriptions are consumer content. Component `disabled` or item `disabled` blocks initiating movement for that item; a disabled item is not a pinned position and may shift when other items move around it.

This is one vertical list: no cross-list transfer, external file drag, grid positioning, multi-item pickup, automatic scrolling, undo history, or tree reparenting. Keep the whole target range visible; long lists should use a dedicated workflow or the click alternatives. This scope avoids implying that a generic drag framework has shipped.

## Reference-card carousel

```ts
import { JpCarousel, JpCarouselSlide } from '@jp-design-system/ui';
```

`jp-carousel` requires a document-unique `id` and accessible `label`. Project keyed slide templates with `jpCarouselSlide`; keys must be unique and non-empty. The optional slide `label` describes its content. Without one, a localized position/count is used. The consumer owns slide content, selected `index`, and any inputs within slides.

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

The model uses a zero-based index. Non-finite/out-of-range values display a clamped position without mutating consumer state during render. `loop` defaults to `true`; set `false` to disable Previous/Next at the ends. `disabled` blocks navigation and automatic rotation. Empty and single-slide states suppress unnecessary picker/rotation controls.

Native Previous/Next buttons and grouped numbered picker buttons retain focus. The current picker uses `aria-disabled` and remains discoverable. The viewport itself is a tab stop: Left/Right follows visual direction in LTR/RTL, Home/End selects the bounds. Key events from inputs, links, buttons, and other slide descendants are not intercepted. Horizontal swipes support touch/pointer gestures; vertical gestures, gestures starting on interactive content, pointer cancellation, and short gestures do not navigate. Buttons provide the same navigation without gestures.

Inactive panels have both `hidden` and `inert`, removing their content from display, interaction, and accessibility navigation. Templates stay instantiated so consumer input state survives navigation. Before a focused panel becomes hidden, focus moves to the viewport; external index changes receive the same protection. Use a consistent slide layout and meaningful content labels; the viewport has a 12rem minimum height but does not clip long content.

The carousel follows the [W3C APG carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/): labeled region and slide groups, native action controls, and explicit control of any rotation. Built-in labels and role descriptions come from `JP_MESSAGES.carousel`.

### Optional rotation

`autoRotate` defaults to `false`. It is explicit consumer opt-in; the reference-card showcase leaves it off. `interval` defaults to 6000ms and clamps to at least 1000ms. Timers begin only after browser render, are cleaned up with the component, and do not run during server rendering.

When opted in, a Pause/Start rotation control precedes the slide content. Hover suspends the timer. Any keyboard focus stops rotation until the user explicitly resumes it; manual navigation also stops it. While rotation is running the positional live region is off; during manual navigation it is polite. `prefers-reduced-motion: reduce` blocks rotation and disables its Start control, with no slide animation in either mode. Preference changes are observed and listeners cleaned up. Non-looping rotation stops at the final slide.

Limits: one visible slide, grouped picker buttons rather than a tablist, no virtualization/media playback/zoom/lightbox, and no animated transition. Keep a modest number of short reference cards; a long document, product grid, or mandatory form sequence should use another pattern. Automated keyboard, browser, cancellation, persistence, and axe checks support the preview APIs; manual screen-reader and forced-colors review is still required for maturity promotion.
