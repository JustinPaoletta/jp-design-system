# Layout, overflow, theme, and density

Layout primitives are `jp-box`, `jp-stack`, `jp-inline`, `jp-grid`, and
`jp-surface`. Application chrome is `jp-app-shell`. Token behavior is in
[the tokens README](../../libs/tokens/README.md). Component APIs are in
[Components](./COMPONENTS.md).

## Responsive shell

`jp-app-shell` switches at `48rem`. The desktop media query is
`width > 48rem`. The mobile query in the component is
`(max-width: 48rem)`, the same cutoff as `--jp-layout-shell-mobile-max`.
Media queries cannot read that custom property, so the stylesheet repeats
the length. The two queries meet with no gap.

Above `48rem` the shell is a two-column grid: sidebar, then main. The expanded width is `--jp-size-sidebar-expanded`. `sidebarCollapsed` switches the column to `--jp-size-sidebar-collapsed`. The collapse control is visible.

The mobile bar is hidden. In the collapsed rail, nav labels are clipped for sighted users and remain available to assistive technology. Labels stay visible in the mobile drawer even when `sidebarCollapsed` is true. Project an icon with `[jpAppShellNavIcon]` if the rail should show a glyph.

At `48rem` and below the grid is one column. A menu button opens a fixed
drawer (`min(expanded width, 85vw)`) and a scrim. Escape, the scrim, and the
close button emit `mobileNavOpenChange` `false`. Focus moves into the drawer
and returns to the menu button on close. The main region is `inert` and
`aria-hidden` while the drawer is open on a mobile viewport. If the viewport
grows past the breakpoint while the drawer is open, the shell emits
`mobileNavOpenChange` `false`.

`sidebarCollapsed` and `mobileNavOpen` are inputs. The shell emits changes
and does not store them. Bind both, as Showcase does in
`apps/showcase/src/app/layout/shell-layout.ts`. One shell per document: the
sidebar id is the fixed string `jp-app-shell-sidebar`.

The main region uses `min-width: 0` and `overflow: auto`, so wide content
scrolls inside the shell instead of stretching the grid.

Chrome strings `Open navigation`, `Close navigation`, `Expand sidebar`, and
`Collapse sidebar` default to those English words and come from
`JP_MESSAGES.appShell`.

## Tables and overflow

`jp-table` keeps a real `<table>`. The frame is `overflow-x: auto`,
`tabindex="0"`, and `role="region"`, labeled by the caption or by
`Data table`. Wide tables scroll horizontally on purpose. They do not stack
into cards. Keyboard users can focus the frame to scroll it.

Give the main column `min-width: 0` (the shell already does) so the frame
can shrink and scroll. `jp-text` `truncate` ellipsizes a single line when
its container is narrower than the text. The host sets `min-width: 0`.

`jp-grid` `mode="fixed"` (the default) repeats the requested column count (`1`, `2`, `3`, `4`, or `6`) with `minmax(0, 1fr)`. Those columns share the row. They do not wrap onto new rows. `mode="auto-fit"` uses `repeat(auto-fit, minmax(min(<min column>, 100%), 1fr))`.

`minColumn` is `sm`, `md`, or `lg` and maps to `--jp-size-column-min-*`. Use `auto-fit` for dashboard cards that should reflow. Use a fixed count when the columns are a known layout.

`jp-inline` wraps by default (`wrap` defaults to `true`). Set `wrap` to
`false` only when a single row is required and overflow is acceptable.

## Assistant panel

The panel width is `--jp-size-assistant-panel-width`, capped at the
viewport. At `max-width: 48rem` a scrim appears and the panel width is
`min(panel width, 100vw)`. Focus is trapped only while the panel is open on
that mobile viewport. Desktop leaves the rest of the page usable. The
assistant service is `providedIn: 'root'`. Place one `jp-assistant-panel`.

## Themes

The system is dark-first. `tokens.css` sets semantic colors on `:root`.
Accent families are `neon` (the default, including when the attribute is
absent) and `cobalt` (`data-jp-accent="cobalt"`). Accent colors primary
actions, focus, active navigation, and selection. It is not a page
background. Semantic success, warning, error, and info stay independent of
the accent.

There is no light component theme. The Storybook light stage is a mat behind
the story page. Docs in Storybook stay on a dark stage.

## Density

Default density is the `:root` scale. Compact density is
`data-jp-density="compact"`. The overrides live in `tokens.css` and in the
optional `tokens.compact.css`. Compact lowers the space scale and the
control sizes (`--jp-size-control-*` for `sm`, `md`, and `lg`).

Compact fits more rows and fields in a tool. Hit targets and line length get
smaller, and long labels have less room before they wrap or truncate. Prefer
default density for forms and first-use screens. Prefer compact for dense
tables once the labels still fit. Set density on the same ancestor as the
accent so the whole shell shares one scale. Mixing densities inside one
screen makes control heights disagree.

Shell, assistant, and button motion drop to none under
`prefers-reduced-motion: reduce`.
