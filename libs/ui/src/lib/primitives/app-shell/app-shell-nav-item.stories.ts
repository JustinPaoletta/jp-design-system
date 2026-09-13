import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { JpAppShellNavItem } from './app-shell-nav-item';

type NavItemStoryArgs = {
  as: 'a' | 'button';
  href: string;
  active: boolean;
  disabled: boolean;
  label: string;
};

const meta: Meta<NavItemStoryArgs> = {
  title: 'Primitives/Layout/App Shell Nav Item',
  component: JpAppShellNavItem,
  globals: {
    accent: 'neon',
  },
  parameters: {
    a11y: { test: 'error' },
  },
  render: (args) => ({
    props: {
      ...args,
      asTag: args.as,
    },
    template: `
      <style>
        .jp-app-shell-nav-item-story {
          max-width: 16rem;
          padding: var(--jp-space-sm);
          background: var(--jp-color-shell-sidebar-bg);
          border: 1px solid var(--jp-color-shell-border);
          border-radius: var(--jp-radius-md);
        }
      </style>
      <div class="jp-app-shell-nav-item-story">
        <jp-app-shell-nav-item
          [as]="asTag"
          [href]="href"
          [active]="active"
          [disabled]="disabled"
          (click)="$event.preventDefault()"
        >
          {{ label }}
        </jp-app-shell-nav-item>
      </div>
    `,
  }),
  args: {
    as: 'a',
    href: '/overview',
    active: false,
    disabled: false,
    label: 'Overview',
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['a', 'button'],
    },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<NavItemStoryArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.jp-app-shell-nav-item__root');
    await expect(root).toBeTruthy();
    await expect(root?.getAttribute('aria-current')).toBeNull();
  },
};

export const Active: Story = {
  args: {
    active: true,
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('.jp-app-shell-nav-item--active');
    const root = canvasElement.querySelector('.jp-app-shell-nav-item__root');
    await expect(host).toBeTruthy();
    await expect(root?.getAttribute('aria-current')).toBe('page');
  },
};

export const FocusVisible: Story = {
  args: {
    label: 'Settings',
    href: '/settings',
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '.jp-app-shell-nav-item__root',
    ) as HTMLElement;
    root.focus();
    await expect(document.activeElement).toBe(root);
  },
};

export const AsButton: Story = {
  args: {
    as: 'button',
    label: 'Activity',
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.jp-app-shell-nav-item__root');
    await expect(root?.tagName).toBe('BUTTON');
  },
};

export const Disabled: Story = {
  args: {
    as: 'button',
    disabled: true,
    label: 'Demo as button',
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector(
      '.jp-app-shell-nav-item--disabled',
    );
    const root = canvasElement.querySelector(
      '.jp-app-shell-nav-item__root',
    ) as HTMLButtonElement;
    await expect(host).toBeTruthy();
    await expect(root.disabled).toBe(true);
  },
};

/** Active item with a projected leading icon and the accent indicator bar. */
export const WithIcon: Story = {
  args: {
    active: true,
    label: 'Overview',
  },
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <div class="jp-app-shell-nav-item-story" style="max-width:16rem;padding:var(--jp-space-sm);background:var(--jp-color-shell-sidebar-bg);border:1px solid var(--jp-color-shell-border);border-radius:var(--jp-radius-md);">
        <jp-app-shell-nav-item
          [as]="asTag"
          [href]="href"
          [active]="active"
          [disabled]="disabled"
          (click)="$event.preventDefault()"
        >
          <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          {{ label }}
        </jp-app-shell-nav-item>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.jp-app-shell-nav-item__icon'),
    ).toBeTruthy();
    await expect(canvasElement.querySelector('svg')).toBeTruthy();
  },
};

/**
 * Collapsed icon rail: inside a `.jp-app-shell--collapsed` context the label is
 * visually hidden (kept for screen readers) and only the icon shows.
 */
export const CollapsedRail: Story = {
  args: {
    active: true,
    label: 'Overview',
  },
  render: (args) => ({
    props: { ...args, asTag: args.as },
    template: `
      <div class="jp-app-shell--collapsed" style="width:var(--jp-size-sidebar-collapsed);padding:var(--jp-space-sm);background:var(--jp-color-shell-sidebar-bg);border:1px solid var(--jp-color-shell-border);border-radius:var(--jp-radius-md);">
        <jp-app-shell-nav-item
          [as]="asTag"
          [href]="href"
          [active]="active"
          [disabled]="disabled"
          (click)="$event.preventDefault()"
        >
          <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          {{ label }}
        </jp-app-shell-nav-item>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    // Label stays in the accessible tree even when visually collapsed.
    const label = canvasElement.querySelector('.jp-app-shell-nav-item__label');
    await expect(label?.textContent?.trim()).toBe('Overview');
  },
};
