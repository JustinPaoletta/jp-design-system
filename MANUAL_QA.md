# Storybook Manual QA Checklist

Click through Storybook top to bottom. For each item: do the action, then confirm the
**Expect** result. If anything differs, note the story path, viewport, and Accent/Density
toolbar state on the PR.

---

## Setup

```bash
npx nx run ui:storybook
```

Open http://localhost:4400. Theme is **dark** (sunken canvas background).

| Tool | What to use it for |
| --- | --- |
| **Accent** toolbar (Neon / Cobalt) | Recolors accent-driven UI only |
| **Density** toolbar (Default / Compact) | Tightens spacing + control sizes (~0.75×) |
| **Viewport** toolbar | Mobile shell/assistant checks (shell breakpoint = `48rem` / 768px) |
| **Interactions** panel | Every story with a `play` function should show **Pass** (green) on load |
| **Accessibility** panel | **No violations** on every story (global gate is `a11y.test: 'error'`; same as CI via `npx nx run ui:test-storybook`) |

Optional once: enable OS **Reduce motion**, then spot-check shell collapse, switch thumb, assistant panel slide, and toast enter — motion should be minimal/off with no layout jump.

### Global toolbar expectations (every story)

- [ ] **Accent Neon → Cobalt** — Only accent-driven surfaces recolor: primary buttons, checked checkbox/switch tracks, active-nav indicator bar, accent badges, assistant context chip + Send, composition accent badges/gradient rules, focus rings. Page background, neutrals, state tones (success/warning/error/info), and assistant message bubbles do **not** wash or recolor.
- [ ] **Density Default → Compact** — Gaps, paddings, and control heights shrink (~0.75×). Colors, type scale, radii, and motion stay the same. Nothing clips, overlaps, or loses a usable hit target. Switching back to Default restores the roomier scale.
- [ ] **Accessibility panel** — Open it on a few stories in each section; it must report **no violations**.

---

## Primitives / Layout / Box

Storybook path: **Primitives → Layout → Box**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Look at canvas; change `padding` and `maxWidth` controls | Dashed outline = box bounds; solid inner block labeled "Box content"; `md` padding on all sides by default. `padding` none→3xl scales evenly. `maxWidth` narrow/wide caps width; `none` fills the frame. |
| **SemanticSection** | Inspect DOM; change `as` | Root element is a real `<section>` (or the selected semantic tag). Styling matches Default. |
| **PaddingXOverride** | Inspect spacing | Base padding `lg`, `paddingX=none`: left/right = 0, top/bottom still padded. |
| **PaddingYOverride** | Inspect spacing | Base padding `lg`, `paddingY=none`: top/bottom = 0, left/right still padded. |
| **MaxWidthNarrow** | Compare to Default | Box width capped at the narrow container token. |

---

## Primitives / Layout / Stack

Storybook path: **Primitives → Layout → Stack**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Change `gap` and `align` | Items A / B / C stacked vertically with even `md` gap; stretch full width. `gap` changes vertical spacing; `align` shifts left/center/right. |
| **SpaceBetween** | Look at canvas | First item at top, last at bottom (`justify="between"` → CSS `space-between`). |
| **Centered** | Look at canvas | Items centered on both axes. |

---

## Primitives / Layout / Inline

Storybook path: **Primitives → Layout → Inline**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Change `justify` | Alpha / Beta / Gamma in one horizontal row, vertically centered, `sm` gap. `justify` moves them start/center/end/`between`. |
| **WrapStress** | Narrow the viewport | 8 items with wrap ON reflow onto new rows; no horizontal page scrollbar. |
| **NoWrap** | Look at the narrow frame; Tab to it | 5 items stay on **one** row; the framed viewport scrolls horizontally. Viewport is keyboard-focusable (`tabindex="0"`, `role="region"`, label "Horizontally scrollable inline demo") and shows a focus ring when focused. |

---

## Primitives / Layout / Grid

Storybook path: **Primitives → Layout → Grid**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Change `columns` (2/4/6) | 3 equal columns by default, `md` gap. Track count updates; cards never overflow their track. |
| **AutoFit** | Shrink viewport; change `minColumn` | 6 cards auto-fit; columns reduce (e.g. 3→2→1) with no horizontal overflow. `minColumn` changes when columns collapse. |

---

## Primitives / Layout / Surface

Storybook path: **Primitives → Layout → Surface**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Change `tone`, `radius`, `border`, `padding`, `elevation` | Two panels on a mid-tone mat: left = elevation `none` reference; right = control panel. Labels use secondary (readable) text. Elevation adds rim + shadow; shadow reads clearly against the mat. |
| **ElevationLadder** | Compare the four panels | Labels none → raised → floating → overlay; shadows get progressively stronger. |

---

## Primitives / Typography / Heading

Storybook path: **Primitives → Typography → Heading**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Change `as`, `tone`, `weight` | Title "Heading Primitive". `as` switches h1–h6 with matching token sizes. `tone`/`weight` change color/boldness. |
| **Scale** | Inspect DOM | All six levels stacked (h1 largest → h6 smallest), monotonic size steps; each row uses the matching `<h1>`…`<h6>` tag. |
| **Tones** | Read all four lines | Four h3s: primary → secondary → muted → disabled. All readable (AA). Disabled may look very close to muted (same token step after contrast fix) but must not disappear into the background. |

---

## Primitives / Typography / Text

Storybook path: **Primitives → Typography → Text**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Change `as`; set `as=label` + `forId` | Body paragraph. Tag switches among p/span/label/small/strong/em. With `as=label` + `forId`, the rendered `<label>` has a matching `for`. |
| **Sizes** | Compare the three lines | body-lg → body → caption, clearly different sizes. |
| **Tones** | Read all four lines | primary → secondary → muted → disabled, all legible on the dark canvas (same muted/disabled caveat as Heading). |
| **Truncated** | Toggle `truncate` | Long sentence in a narrow panel is **one line** with an ellipsis when truncate is on; turns off → wraps to multiple lines. |

---

## Primitives / Layout / App Shell

Storybook path: **Primitives → Layout → App Shell**

> For **Mobile** / **Mobile Drawer Open**, set the Storybook viewport to a width **under 768px** (e.g. mobile / 390×844). Desktop stories need a wide viewport.

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Inspect layout, nav, toggle; Tab; switch Accent | Two columns: left sidebar, right main with heading **"Main content"**. Nav: Overview (active) / Activity / Settings with icons. Active = thin accent **indicator bar** on the left + subtle neutral fill — **not** a solid accent block. Collapse chevron points toward collapse ("<"). Toggle: `aria-expanded="true"`, `aria-controls="jp-app-shell-sidebar"`. Active link: `aria-current="page"` on the **inner** control. `<aside>` named "Primary" and has **no** `aria-expanded`. Focus rings visible. Neon↔Cobalt recolors indicator + focus ring only. |
| **Collapsed** | Inspect rail + toggle | Narrow icon rail; labels visually hidden (still in the a11y tree); icons remain; active still distinguishable; chevron points to expand (">"); toggle `aria-expanded="false"`, `aria-label="Expand sidebar"`. |
| **Collapse Toggle** | Click collapse, then expand; check Interactions | Rail **animates** (eases) closed then open — no hard snap. Interactions panel **Pass**. With Reduce motion: width change is instant, no flicker. |
| **Mobile** | Mobile viewport; click hamburger | Top bar + hamburger; sidebar off-canvas. Hamburger starts `aria-expanded="false"`, `aria-label="Open navigation"`. Click → drawer slides in from left + dimmed scrim; `aria-expanded="true"` and label becomes **"Close navigation"**; focus moves into the drawer (first focusable control is the drawer close **×**). |
| **Mobile Drawer Open** | Mobile viewport; Escape / scrim / Tab | Drawer open over scrim; main has `inert` (not clickable/tabbable). Escape closes; reopen and click scrim → closes; Tab/Shift+Tab stay trapped in the drawer; on close, focus returns to the hamburger. Interactions panel **Pass**. |

---

## Primitives / Layout / App Shell Nav Item

Storybook path: **Primitives → Layout → App Shell Nav Item**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Hover; Tab | Inactive "Overview"; no indicator bar; no `aria-current`. Hover soft background; Tab shows focus ring. |
| **Active** | Switch Accent | Left accent indicator bar + `aria-current="page"`. Neon↔Cobalt changes indicator hue. |
| **FocusVisible** | Look at canvas on load | Item is focused with a clear accent focus ring. |
| **AsButton** | Inspect DOM | Root control is a real `<button>`; styling matches the link variant. |
| **Disabled** | Try click / Tab | Muted; not activatable; not focusable. |
| **WithIcon** | Look at alignment | Active item with leading icon + label + indicator bar, neatly aligned. |
| **CollapsedRail** | Inspect visually + DOM | Only the icon shows in a narrow rail; label text still present for screen readers. |

---

## Primitives / Controls / Button

Storybook path: **Primitives → Controls → Button**

| Story | Do | Expect |
| --- | --- | --- |
| **Primary** | Hover; Tab; switch Accent | Filled accent button labeled "Primary". Hover darkens via hover token. Tab → 2px focus ring with offset. Neon↔Cobalt changes fill only (page bg unchanged). |
| **Secondary** | Hover; Tab | Bordered / subtle fill; hover changes background; border stays; focus ring on Tab. |
| **Ghost** | Hover | Transparent at rest (text only); hover shows subtle background + text shift. |
| **Destructive** | Switch Accent to Cobalt | Error/red tokens — **not** accent. Stays red under Cobalt. |
| **Disabled** | Try click / Tab | Dimmed (~50% opacity), `not-allowed` cursor, not focusable/clickable, no hover change. |
| **Sizes** | Compare row; try Compact density | Small / Medium / Large with increasing height, padding, and font-size. Compact shrinks all three proportionally. |

---

## Primitives / Controls / Icon Button

Storybook path: **Primitives → Controls → Icon Button**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Inspect; Tab; hover | Square icon-only button; `aria-label="Collapse sidebar"`; inner icon `aria-hidden`. Tab → focus ring; hover → subtle ghost background. |
| **Sizes** | Compare three buttons | sm / md / lg squares with scaled glyphs; each has its own descriptive `aria-label`. |
| **Disabled** | Try activate | Dimmed, `not-allowed`, not focusable; `aria-label` still present. |

---

## Primitives / Controls / Input

Storybook path: **Primitives → Controls → Input**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Click label; type; Tab | Label **Email**, text field, muted hint "Used for account notifications." Label click focuses the input. Typing updates value. Focus ring on Tab. |
| **Invalid** | Inspect DOM + colors | Invalid border + error text **"Enter a valid email address."** (no hint). Error text is a **light/coral** red readable on the dark canvas. Input has `aria-invalid="true"` and `aria-describedby` → the error node (`role="alert"`). |
| **Disabled** | Try type / focus | Dimmed; cannot type or focus; no hover border change. |
| **Readonly** | Try type; focus | Value cannot change; still focusable/selectable; hint "This value cannot be edited."; no hover border. |
| **Sizes** | Compare three fields; try Compact | Small / Medium / Large stacked with increasing height/padding/font. Compact shortens them. |
| **Typing** | Watch Interactions (or type yourself) | Play leaves the field with value `a@b.co` (or you can type the same). Interactions **Pass**. |

---

## Primitives / Controls / Textarea

Storybook path: **Primitives → Controls → Textarea**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Type; drag resize handle; Tab | Label **Notes**, 4-row box (`rows=4`), hint. Vertical resize only via corner handle. Focus ring on Tab. |
| **Invalid** | Inspect | Invalid border + error **"Notes are required."** (light/coral red). `aria-invalid="true"` + `aria-describedby` → error (`role="alert"`). |
| **Disabled** | Try type / resize | Dimmed; cannot type, focus, or resize. |
| **Readonly** | Try type | No edits; still focusable; hint "This value cannot be edited." |

---

## Primitives / Controls / Select

Storybook path: **Primitives → Controls → Select**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Open select; choose option; click label | Label **Role**, native `<select>` with Admin / Editor / Viewer, plus hint. Choice sticks. Label click focuses the select. Focus ring on Tab. |
| **Invalid** | Inspect | Invalid border + error **"Select a role."** `aria-invalid="true"` + `aria-describedby` → error. |
| **Disabled** | Try open | Dimmed; cannot open/focus; `not-allowed` cursor. |

---

## Primitives / Controls / Checkbox

Storybook path: **Primitives → Controls → Checkbox**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Click box; click label text; Tab + Space; switch Accent | Label "Subscribe to product updates". Box and label each toggle **once** (no double-toggle). Space toggles when focused. Checked = accent fill + check glyph. Neon↔Cobalt changes the checked fill. |
| **Checked** | Click to toggle | Starts ON (`jp-checkbox--checked`, accent fill + check). Click unchecks / re-checks. |
| **Invalid** | Inspect | Invalid-colored box border; input `aria-invalid="true"`. |
| **Disabled** | Try click | Dimmed, `not-allowed`; box/label do nothing; not focusable. |

---

## Primitives / Controls / Switch

Storybook path: **Primitives → Controls → Switch**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Click track; click label; Tab + Space/Enter; open Accessibility panel | Label "Compact density". Track toggles; thumb slides; ON track uses accent. Label click also toggles. Space **and** Enter toggle when focused. Control is `role="switch"` with `aria-checked` flipping. Accessible name is **"Compact density"** (Accessibility panel). |
| **On** | Inspect; optional Reduce motion | Starts ON (accent track, thumb right, `aria-checked="true"`, `jp-switch--checked`). With Reduce motion, thumb does not animate. |
| **Invalid** | Inspect | Invalid-colored inset outline; `aria-invalid="true"`. |
| **Disabled** | Try activate | Dimmed, `not-allowed`; click/Space/Enter do nothing; not focusable. |

---

## Primitives / Data Display / Badge

Storybook path: **Primitives → Data Display → Badge**

| Story | Do | Expect |
| --- | --- | --- |
| **Neutral** | Look | Pill "Neutral": soft neutral fill + secondary text; rounded; semibold. Meaning is in the text, not color alone. |
| **Accent** | Switch Neon ↔ Cobalt | Soft accent **fill** + **near-black ink** text (`accent-contrast`) — a signal chip, not a full-saturation wash. Fill hue follows Accent; text stays dark ink for contrast. |
| **Success / Warning / Error / Info** | Switch Accent; read labels | Soft state fills + **darker** matching text (strong step). These do **not** follow the Accent toolbar. Labels ("Success", etc.) carry meaning. |
| **Small** | Compare to medium mental model | Compact accent badge; reduced horizontal padding; same caption font size as medium. |
| **Sizes** | Compare side-by-side | "Small" and "Medium" accent badges; md taller/wider via padding; both vertically centered. |
| **All Tones** | Narrow viewport | All six tones in a row with even spacing; wrap without clipping when narrow. |

---

## Primitives / Data Display / Empty State

Storybook path: **Primitives → Data Display → Empty State**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Tab to the button | Centered: muted diamond icon (◇), bold **"No deployments"**, description **"Create a deployment to see it listed here."**, primary **"New deployment"** button. Host `role="status"`; icon `aria-hidden`. Button gets a visible focus ring. |
| **Title Only** | Look | Only centered title **"Nothing here"** — no icon, description, or action. |
| **Without Action** | Look | Icon + **"No results"** + **"Try adjusting your search or filters."**; **no** button. |

---

## Primitives / Data Display / Table

Storybook path: **Primitives → Data Display → Table**

| Story | Do | Expect |
| --- | --- | --- |
| **Populated** | Hover a row; inspect DOM | Caption **"Recent deployments"**. Headers **Service / Status / Region**; Region header + cells end-aligned. Status column has badges (Healthy=success, Degraded=warning). Striped rows. Row hover = subtle surface tint (**not** accent). Real `<table>`, `<caption>`, `<th scope="col">`. Outer frame is a focusable region (`tabindex="0"`) with an accessible name from the caption. |
| **Plain** | Hover a row | Same table **without** striping; hover tint still works. |
| **Empty** | Look below headers | Headers present; no data rows; empty state **"No deployments"** + **"Clear filters"** under a top border; empty state `role="status"`. |
| **Scrollable** | Scroll horizontally; Tab to frame | Frame max-width ~32rem; 8 columns; horizontal scroll. Caption **"Service health (scroll horizontally)"**. Numeric **Requests / min** and **p95 latency (ms)** end-aligned. Frame is keyboard-focusable and shows a focus ring. |

---

## Primitives / Feedback / Tooltip

Storybook path: **Primitives → Feedback → Tooltip**

| Story | Do | Expect |
| --- | --- | --- |
| **Top** | Hover; move away; Tab; Escape | Button "Hover me". Hover → tooltip **"Copy deployment ID"** above, centered. Leave → hides. Focus → shows; Escape hides; focus stays on the button. While open: trigger has `aria-describedby` → tooltip (`role="tooltip"`); attribute removed when closed. |
| **TopInteractive** | Watch Interactions | Play opens the tooltip and asserts the copy; **Pass**. |
| **Bottom / Left / Right** | Hover or focus each | Tooltip appears on the named side, centered on that axis; Escape closes. |

---

## Primitives / Feedback / Toast

Storybook path: **Primitives → Feedback → Toast**

| Story | Do | Expect |
| --- | --- | --- |
| **Neutral** | Look; focus the × | Static toast: neutral left border, message **"Neutral notification"**, dismiss ×. × has hover + focus ring (static story does not remove the toast). |
| **Success** | Look | Success-colored left border; message **"Saved successfully"**. |
| **Warning** | Look | Warning-colored left border; message **"Check configuration"**. |
| **Error** | Look | Error-colored left border; message **"Deploy failed"**. |
| **ViaService** | Click **Show toast**; wait; dismiss; change controls | Toast appears **bottom-right**, auto-dismisses after ~4s. Focus stays on **Show toast** (toast must not steal focus). Toast `role="status"`. × dismisses immediately. `message` / `tone` controls affect the next toast. |
| **ViaServiceInteractive** | Watch Interactions | Play clicks and asserts **"Deployment saved"**; **Pass**. |

---

## Primitives / Feedback / Dialog

Storybook path: **Primitives → Feedback → Dialog**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Open; Tab; Escape; scrim; actions | **Open dialog** → centered modal over dimmed scrim; title **"Delete deployment?"**; Cancel + Delete. Focus moves into the dialog; Tab cycles only inside (trap); Shift+Tab wraps. Escape / scrim / × / Cancel / Delete close and restore focus to the trigger. Inside-panel clicks do **not** close. `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → title. |
| **Open** | On load; Escape | Dialog already open. Interactions asserts dialog + `aria-modal`; **Pass**. Trap + Escape still work. |

---

## Primitives / Feedback / Popover

Storybook path: **Primitives → Feedback → Popover**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Toggle; outside click; Escape | **Filters** opens a panel below-left with content **"Filter panel content"** (primitive story). Trigger again closes (no flicker). Outside click closes. Escape closes. Trigger toggles `aria-expanded` and has `aria-controls`; panel is `[hidden]` when closed. |
| **PanelOpen** | Watch Interactions | Play opens and asserts content; **Pass**. |

---

## Primitives / Feedback / Dropdown Menu

Storybook path: **Primitives → Feedback → Dropdown Menu**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Open; Arrow keys; Escape; select; outside click | **Actions** opens menu with **Edit** / **Delete**. Focus lands on the **first** item. ArrowDown/Up move and **wrap**; Home/End jump ends. Escape closes and **returns focus to Actions**. Choosing an item closes and returns focus to the trigger. Outside click closes **without** forcing focus back to the trigger. Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`. Panel `role="menu"`; items `role="menuitem"`. |
| **MenuOpen** | Watch Interactions | Play asserts `role="menu"` + "Edit"; **Pass**. |
| **KeyboardNavigation** | Watch Interactions | Play: open → first focused → ArrowDown → second → ArrowUp wraps to first; **Pass**. |
| **WithDisabledItem** | Arrow through; click Delete | Open menu: Edit / **Delete (disabled)** / Duplicate. Delete muted + `not-allowed`. Arrows skip Delete (Edit ↔ Duplicate). Clicking Delete does nothing and leaves the menu open. |

---

## Primitives / Assistant / Panel

Storybook path: **Primitives → Assistant → Panel**

> Most stories render a small host with buttons (**Ask about deployment**, **Seed conversation**, **Open empty**) plus the panel. **MessageRoles** is messages only (no panel chrome).

| Story | Do | Expect |
| --- | --- | --- |
| **MessageRoles** | Look; switch Accent; optional SR | Three messages only (no panel chrome): muted full-width **System** ("Context loaded for dep-1042"), left **Assistant** on sunken surface, right **User** on subtle surface. Bodies stay neutral. Accent does **not** recolor bubbles. Visually-hidden role labels announce You / Assistant / System to AT. |
| **EmptyState** | Click **Open empty** (or let play run) | Panel opens from the right; empty title **"Ask about this surface"** and description **"Open the assistant from a context trigger, then send a question."** No context chip. Composer placeholder **"Ask a question…"**. Send disabled while composer empty. Interactions **Pass**. Accessibility clean. |
| **Conversation** | Click **Seed conversation** (or let play run) | Panel opens with context chip **"Deployment dep-1042"** (soft accent fill + **dark ink** label text) and description **"Production rollout"** (same ink family, slightly softer). Three messages including assistant line **"I can summarize status, risks, and next steps."** Header/composer stay put while messages scroll. Neon↔Cobalt changes chip + Send only. |
| **ContextTrigger** | Click **Ask about deployment**; clear chip; Escape; × | Panel `role="complementary"`. Chip shows Deployment dep-1042 / Production rollout. Focus moves to the composer textarea. Send starts disabled. Chip × clears context; panel stays open. Escape or header × closes and restores focus to the trigger. |
| **ComposerInteraction** | Type; Enter; try Shift+Enter; try empty Send | Typing enables Send. Enter sends → user bubble with your text + assistant reply starting with **Noted:** (e.g. `Noted: “What is the deployment status?”. Here is a calm, structured reply.`). Shift+Enter inserts a newline (does not send). Composer clears after send. Empty/whitespace cannot send. Composer accessible name is **"Message the assistant"**; placeholder **"Ask a question…"**. |
| **Any open panel (mobile)** | Viewport &lt; 48rem | Scrim behind panel; tap/click scrim closes; Tab trapped inside while open. Closed panel is `inert` / `aria-hidden` and not tabbable. Reduce motion → no slide animation. |

---

## Compositions / Layout Dashboard

Storybook path: **Compositions → Layout Dashboard → Dashboard**

| Do | Expect |
| --- | --- |
| Scan the page | **Layout Dashboard** h1 + accent badge (shows current accent name), subtitle, `accent:` / `density:` readout, gradient accent rule (`aria-hidden`). KPI row (Active sessions / Error rate / Avg response) as **text**, not headings. Sections **Activity**, **Insights**, **Recent Events** as **h2**. Recent Events rows: label left, timestamp right. |
| Switch Accent | Badge, gradient rule, and accent KPI value ("1,284") recolor; readout updates. |
| Switch Density | Readout shows `compact` or `default`; spacing tightens in Compact. |
| Accessibility | No violations; heading order **h1 → h2** (no skipped levels). |

---

## Compositions / App Shell Dashboard

Storybook path: **Compositions → App Shell Dashboard → Dashboard**

| Do | Expect |
| --- | --- |
| Scan the page | Shell + **"App Shell Dashboard"** h1, accent badge, gradient rule, KPI stats as text, **Activity** / **Insights** as **h2**, `accent:` / `density:` readout. Overview nav active with accent indicator. |
| Switch Accent / Density | Badge, rule, active indicator, focus rings follow Accent; neutrals stable. Compact tightens spacing; readout matches toolbar. |
| Collapse sidebar | Rail collapses/expands; main reflows without clipping. |
| Mobile viewport | Hamburger opens drawer + scrim; main inert; Escape / scrim / × dismiss; focus managed. |

---

## Compositions / Controls Form

Storybook path: **Compositions → Controls Form → Default**

| Do | Expect |
| --- | --- |
| Scan the page | Shell nav: **Settings** (active) / **Profile**. Main: **"Controls Form"** h1 + **More actions** icon button. Raised form: Email, Notes, Role (Admin/Editor/Viewer), Subscribe checkbox, Compact density switch, buttons Save (primary) / Cancel (secondary) / Reset (ghost) / Delete (destructive). `accent:` / `density:` readout. |
| Tab through | Order: sidebar → icon button → email → notes → role → checkbox → switch → Save/Cancel/Reset/Delete. Visible focus ring every stop. |
| Interact | Type email, toggle checkbox/switch, change role — all stick. Accent recolors Save + checked/on selection controls; Delete stays error-red. Compact shortens controls/spacing. Interactions **Pass** (email ends as `demo@jp.dev` if play ran). |

---

## Compositions / Data Display

Storybook path: **Compositions → Data Display → Default**

| Do | Expect |
| --- | --- |
| Scan the page | Shell nav: **Data** (active) / **Controls**. **"Data Display"** h1, subtitle, readout. Badge legend: Healthy / Degraded / Failed / Accent. **"Deployments"** h2 + table (Service / Environment / Status / Region) + **Show empty state** switch. |
| Toggle empty | Switch ON → table body becomes empty state **"No deployments"** + **"Clear filters"**. Clear filters (or switch OFF) restores the three rows. |
| Accent / Density | Accent badges + active nav follow Accent; state badges do not. Compact tightens spacing. |
| A11y | Focus rings on nav, switch, empty action; heading order h1 → h2. Table frame focusable. |

---

## Compositions / Feedback Overlays

Storybook path: **Compositions → Feedback Overlays → Default**

| Do | Expect |
| --- | --- |
| Scan the page | Shell nav **Overlays** active. **"Feedback & Overlays"** h1, readout, toolbar: **Copy ID**, **Show toast**, **Delete**, **Filters**, **Actions**. |
| Tooltip | Hover **Copy ID** → "Copy deployment ID". |
| Toast | **Show toast** → success toast bottom-right; auto-dismisses; does not steal focus. |
| Dialog | **Delete** → confirm dialog; focus trapped; Cancel/Escape closes and restores focus. |
| Dropdown → dialog | **Actions** → **Delete…** opens the dialog; menu closes; focus lands in the dialog (not yanked back to Actions). |
| Popover | **Filters** → panel with **"Filter panel"** (composition copy); Escape / outside click closes. |
| Interactions | Play asserts heading, opens then cancels dialog; **Pass**. |

---

## Compositions / Assistant System

Storybook path: **Compositions → Assistant System**

| Story | Do | Expect |
| --- | --- | --- |
| **Default** | Click each trigger; switch Accent | Shell nav **Assistant** active. **"Assistant System"** h1, readout, section **"Context triggers"** (h2) with **Ask about deployment** (secondary) and **Ask about filters** (ghost, clears messages). Trigger opens the panel with the matching context chip (soft accent fill + dark ink). Chip + Send follow Accent; message bubbles stay neutral. |
| **Compact** | Compare to Default; check readout | Same composition with Density toolbar defaulted to **Compact**. Spacing/control sizes are visibly tighter than Default. Readout shows `density: compact`. Accent still only on chip + Send. |

---

## Known issues (do not file as bugs)

1. **Select empty value** — If a consumer binds an empty string and no matching option exists, the browser may show the first option while the model stays empty. Out of scope for these primitives.

**Automated gate:** `parameters.a11y.test: 'error'` in `libs/ui/.storybook/preview.ts`. `npx nx run ui:test-storybook` must stay green; the Accessibility panel matches that standard.

---

## Sign-off

| Gate | Pass? |
| --- | --- |
| `npx nx run ui:lint` | |
| `npx nx run ui:test` | |
| `npx nx run ui:test-storybook` (Interactions + a11y) | |
| This checklist on **Neon** | |
| This checklist on **Cobalt** | |
| Spot-check **Compact** density on Controls Form + Assistant Compact | |

If anything fails, note story path, viewport, Accent/Density, and repro steps on the PR.

Tester: ______________ Date: ______________
