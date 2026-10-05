# Composition

Build screens from the primitives in [Components](./COMPONENTS.md). Showcase
routes that already assemble them:

| Route               | Page                                  |
| ------------------- | ------------------------------------- |
| `/product-recipes`  | Forms, table tools, dialog            |
| `/layout-dashboard` | Layout dashboard                      |
| `/app-shell`        | Shell                                 |
| `/controls`         | Form controls                         |
| `/data`             | Table and empty data                  |
| `/overlays`         | Dialog, popover, menu, toast, tooltip |
| `/assistant`        | Assistant triggers and panel          |

`/` redirects to `/assistant`. Storybook groupings are
`Compositions/Layout Dashboard`, `Compositions/App Shell Dashboard`,
`Compositions/Controls Form`, `Compositions/Data Display`,
`Compositions/Feedback Overlays`, and `Compositions/Assistant System`.

Copy for headings, errors, and empty states follows
[Writing](../content/WRITING.md).

## Validation summary

Field `error` strings handle individual controls. A summary covers the form
when submit fails validation or the request fails. The recipes page uses the
request failure pattern: an error-tone `jp-inline-alert` above the submit
button, with `action` bound to the same save method. Gate each field error
on `touched` so the summary and the fields appear together after
`markAllAsTouched()`.

```html
@if (submitted() && form.invalid) {
<jp-inline-alert tone="error" title="Check the highlighted fields" message="Name and owner are required." />
}
```

Keep that summary next to the fields. A toast will not stay with the form.

## Page header

The recipes page stacks a breadcrumb, one `h1`, and a secondary lead:

```html
<jp-box padding="lg" maxWidth="wide">
  <jp-stack gap="lg">
    <jp-breadcrumbs
      [items]="[
        { label: 'Dashboard', href: '/layout-dashboard' },
        { label: 'Product recipes' },
      ]"
    />
    <jp-heading as="h1">Product recipes</jp-heading>
    <jp-text tone="secondary">Short description of this page.</jp-text>
    <jp-inline gap="sm" justify="between">
      <jp-heading as="h2">Services</jp-heading>
      <jp-button type="button" variant="primary">Create service</jp-button>
    </jp-inline>
  </jp-stack>
</jp-box>
```

The last breadcrumb is current-page text even if it has `href`. Section
titles step down (`h2`, then `h3`). Actions in the header are `jp-button` or
`jp-icon-button` with an `ariaLabel`.

## Navigation

Wrap the router outlet in `jp-app-shell`. Store `sidebarCollapsed` and
`mobileNavOpen` on the layout component and bind the change outputs.
Showcase `ShellLayout` (`apps/showcase/src/app/layout/shell-layout.html`)
sets `active` from the current URL and navigates like this:

```html
<jp-app-shell-nav-item href="/data" [active]="isActive('/data')" (click)="onNavClick($event, '/data')"> Data </jp-app-shell-nav-item>
```

```ts
onNavClick(event: Event, path: string): void {
  event.preventDefault();
  this.router.navigateByUrl(path);
  this.mobileNavOpen = false;
}
```

`routerLink` on the host does not land on the inner anchor. `as="button"`
is for an action that is not a URL. Disabled items set `tabindex` to `-1`
and drop `href`.

Inside a page, `jp-tabs` plus one `ng-template jpTabPanel` per value splits
peer sections. Supply an explicit `id` for repeated client instances or
application focus links. SSR/hydration remain outside the support contract. `jp-breadcrumbs` covers the trail above the tabs. The
recipes page uses both.

## Empty, loading, and error

| State                              | Composition                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| First load, no rows yet            | `jp-progress` with a `label`, plus `jp-skeleton` placeholders. Set `aria-busy="true"` on the region.                                   |
| Refresh failed, rows already shown | Keep the table. Add `jp-inline-alert` `tone="error"` and a retry `action`.                                                             |
| Query matched nothing              | `jp-table` `emptyTitle` / `emptyDescription`, or a projected `jp-empty-state`.                                                         |
| Nothing has been created           | `jp-empty-state` with a `title`, optional `description`, optional `[jpEmptyStateIcon]`, and a primary `jp-button` in the default slot. |
| Request finished                   | Remove the skeletons and clear `aria-busy`.                                                                                            |

`jp-skeleton` is decorative. It does not replace the progress name or the
alert. The recipes page shows progress and skeletons only while `loading()`
is true, then the table of `visible()` rows.

## Responsive dashboard

Put the dashboard in `jp-app-shell` so the main region can scroll and shrink.
Use `jp-grid` `mode="auto-fit"` for cards that reflow, and `jp-surface` for
each card. Storybook
[Compositions/Layout Dashboard](../../libs/ui/src/lib/primitives/layout-dashboard.stories.ts)
and Showcase `/layout-dashboard` are the references.

```html
<jp-app-shell [sidebarCollapsed]="sidebarCollapsed" [mobileNavOpen]="mobileNavOpen" (sidebarCollapsedChange)="sidebarCollapsed = $event" (mobileNavOpenChange)="mobileNavOpen = $event">
  <nav jpAppShellSidebar>
    <!-- nav items -->
  </nav>
  <main jpAppShellMain>
    <jp-box padding="lg">
      <jp-stack gap="lg">
        <jp-heading as="h1">Overview</jp-heading>
        <jp-grid mode="auto-fit" minColumn="sm" gap="md">
          <jp-surface tone="raised" padding="md">
            <jp-stack gap="xs">
              <jp-text size="caption" tone="muted">Open incidents</jp-text>
              <jp-heading as="h2">3</jp-heading>
            </jp-stack>
          </jp-surface>
        </jp-grid>
      </jp-stack>
    </jp-box>
  </main>
</jp-app-shell>
```

A data-heavy dashboard can set `data-jp-density="compact"` on the shell's
ancestor. Read [Layout](./LAYOUT.md) before mixing densities. Tables inside
the main slot scroll on the table frame. They stay tables at narrow widths.
