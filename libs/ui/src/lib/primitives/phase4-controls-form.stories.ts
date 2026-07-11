import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { expect, userEvent } from 'storybook/test';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpBox } from './box/box';
import { JpButton } from './button/button';
import { JpCheckbox } from './checkbox/checkbox';
import { JpHeading } from './heading/heading';
import { JpIconButton } from './icon-button/icon-button';
import { JpInline } from './inline/inline';
import { JpInput } from './input/input';
import { JpSelect } from './select/select';
import { JpStack } from './stack/stack';
import { JpSurface } from './surface/surface';
import { JpSwitch } from './switch/switch';
import { JpText } from './text/text';
import { JpTextarea } from './textarea/textarea';

type ControlsFormArgs = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  email: string;
  notes: string;
  role: string;
  subscribe: boolean;
  compact: boolean;
};

const meta: Meta<ControlsFormArgs> = {
  title: 'Compositions/Controls Form',
  component: JpAppShell,
  globals: {
    accent: 'neon',
  },
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        JpAppShell,
        JpAppShellNavItem,
        JpBox,
        JpStack,
        JpInline,
        JpSurface,
        JpText,
        JpHeading,
        JpButton,
        JpIconButton,
        JpInput,
        JpTextarea,
        JpSelect,
        JpCheckbox,
        JpSwitch,
      ],
    }),
  ],
  args: {
    sidebarCollapsed: false,
    mobileNavOpen: false,
    email: '',
    notes: '',
    role: 'editor',
    subscribe: true,
    compact: false,
  },
  render: (args, { updateArgs }) => ({
    props: {
      ...args,
      documentAccent:
        document.documentElement.getAttribute('data-jp-accent') ?? 'neon',
      documentDensity:
        document.documentElement.getAttribute('data-jp-density') ?? 'default',
      roleOptions: [
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'viewer', label: 'Viewer' },
      ],
      onSidebarCollapsedChange(next: boolean) {
        updateArgs({ sidebarCollapsed: next });
      },
      onMobileNavOpenChange(next: boolean) {
        updateArgs({ mobileNavOpen: next });
      },
    },
    template: `
      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed"
        [mobileNavOpen]="mobileNavOpen"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <nav jpAppShellSidebar>
          <jp-stack gap="2xs">
            <jp-app-shell-nav-item href="#settings" [active]="true">
              Settings
            </jp-app-shell-nav-item>
            <jp-app-shell-nav-item href="#profile">
              Profile
            </jp-app-shell-nav-item>
          </jp-stack>
        </nav>

        <main jpAppShellMain>
          <jp-box padding="lg" maxWidth="narrow">
            <jp-stack gap="lg">
              <jp-stack gap="xs">
                <jp-inline align="center" gap="sm" justify="between">
                  <jp-heading as="h1">Controls Form</jp-heading>
                  <jp-icon-button ariaLabel="More actions">
                    <svg viewBox="0 0 16 16" width="100%" height="100%" aria-hidden="true">
                      <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                    </svg>
                  </jp-icon-button>
                </jp-inline>
                <jp-text tone="secondary">
                  Phase 4 control composition inside the app shell.
                </jp-text>
                <jp-inline gap="sm">
                  <jp-text as="small" tone="muted">accent: {{ documentAccent }}</jp-text>
                  <jp-text as="small" tone="muted">density: {{ documentDensity }}</jp-text>
                </jp-inline>
              </jp-stack>

              <jp-surface tone="raised" padding="md" border="subtle" elevation="none">
                <form>
                  <jp-stack gap="md">
                    <jp-input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      hint="Used for account notifications."
                      [(ngModel)]="email"
                      name="email"
                    />
                    <jp-textarea
                      label="Notes"
                      rows="3"
                      [(ngModel)]="notes"
                      name="notes"
                    />
                    <jp-select
                      label="Role"
                      [options]="roleOptions"
                      [(ngModel)]="role"
                      name="role"
                    />
                    <jp-checkbox [(ngModel)]="subscribe" name="subscribe">
                      Subscribe to product updates
                    </jp-checkbox>
                    <jp-switch [(ngModel)]="compact" name="compact">
                      Compact density
                    </jp-switch>
                    <jp-inline gap="sm" wrap="true">
                      <jp-button variant="primary" type="submit">Save</jp-button>
                      <jp-button variant="secondary" type="button">Cancel</jp-button>
                      <jp-button variant="ghost" type="button">Reset</jp-button>
                      <jp-button variant="destructive" type="button">Delete</jp-button>
                    </jp-inline>
                  </jp-stack>
                </form>
              </jp-surface>
            </jp-stack>
          </jp-box>
        </main>
      </jp-app-shell>
    `,
  }),
};

export default meta;
type Story = StoryObj<ControlsFormArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('jp-app-shell')).toBeTruthy();
    await expect(
      canvasElement.querySelector('jp-button.jp-button--primary'),
    ).toBeTruthy();
    const email = canvasElement.querySelector(
      'jp-input input',
    ) as HTMLInputElement | null;
    await expect(email).toBeTruthy();
    if (email) {
      await userEvent.clear(email);
      await userEvent.type(email, 'demo@jp.dev');
      await expect(email.value).toBe('demo@jp.dev');
    }
  },
};
