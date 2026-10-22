import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule, type NgForm } from '@angular/forms';
import { expect, userEvent } from 'storybook/test';
import { JpAppShell } from './app-shell/app-shell';
import { JpAppShellNavItem } from './app-shell/app-shell-nav-item';
import { JpButton } from './button/button';
import { JpCard } from './card/card';
import { JpCheckbox } from './checkbox/checkbox';
import { JpDisclosure } from './disclosure/disclosure';
import { JpHeading } from './heading/heading';
import { JpInput } from './input/input';
import { JpSelect } from './select/select';
import { JpStack } from './stack/stack';
import { JpSwitch } from './switch/switch';
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
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        JpAppShell,
        JpAppShellNavItem,
        JpStack,
        JpHeading,
        JpButton,
        JpCard,
        JpInput,
        JpTextarea,
        JpSelect,
        JpCheckbox,
        JpDisclosure,
        JpSwitch,
      ],
    }),
  ],
  args: {
    sidebarCollapsed: false,
    mobileNavOpen: false,
    email: 'manager@rays.example',
    notes: '',
    role: 'editor',
    subscribe: true,
    compact: false,
  },
  render: (args) => {
    const sidebarCollapsed = signal(Boolean(args.sidebarCollapsed));
    const mobileNavOpen = signal(Boolean(args.mobileNavOpen));
    const defaults = {
      email: args.email,
      notes: args.notes,
      role: args.role,
      subscribe: args.subscribe,
    };
    const saved = signal<typeof defaults | null>({ ...defaults });
    const feedback = signal('');
    return {
      props: {
        ...args,
        sidebarCollapsed,
        mobileNavOpen,
        saved,
        feedback,
        save(form: NgForm) {
          saved.set({ ...form.value });
          form.form.markAsPristine();
          feedback.set('Lineup saved in this preview.');
        },
        cancel(form: NgForm) {
          form.resetForm(saved() ?? defaults);
          feedback.set('Changes canceled.');
        },
        reset(form: NgForm) {
          form.resetForm(defaults);
          feedback.set('Default lineup restored.');
        },
        deleteLineup(form: NgForm) {
          saved.set(null);
          form.resetForm(defaults);
          feedback.set('Saved lineup removed from this preview.');
        },
        roleOptions: [
          { value: 'admin', label: 'Manager' },
          { value: 'editor', label: 'Scorekeeper' },
          { value: 'viewer', label: 'Fan' },
        ],
        onSidebarCollapsedChange(next: boolean) {
          sidebarCollapsed.set(next);
        },
        onMobileNavOpenChange(next: boolean) {
          mobileNavOpen.set(next);
        },
      },
      template: `
      <style>
.lineup-editor {
  box-sizing: border-box;
  max-inline-size: 48rem;
  margin-inline: auto;
  padding: 32px 24px;
}
.lineup-editor__header {
  margin-block-end: 24px;
}
.lineup-editor p {
  margin: 0;
  color: var(--jp-color-text-secondary);
  font-size: var(--jp-font-size-body-sm);
  line-height: var(--jp-font-line-height-normal);
}
.lineup-editor__header p {
  margin-block-start: 8px;
}
.lineup-editor__fields {
  display: grid;
  gap: var(--jp-space-lg);
}
.lineup-editor h2 {
  margin: 0;
  font-size: var(--jp-font-size-body);
  font-weight: var(--jp-font-weight-semibold);
  line-height: var(--jp-font-line-height-normal);
}
.lineup-editor__contact {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 20px;
}
.lineup-editor__contact > * {
  min-inline-size: 0;
}
.lineup-editor__messages {
  display: grid;
  gap: 4px;
}
.lineup-editor__messages p {
  padding-inline-start: calc(
    var(--jp-size-selection-control) + var(--jp-space-xs)
  );
  font-size: var(--jp-font-size-caption);
}
.lineup-editor__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  inline-size: 100%;
}
.lineup-editor__feedback {
  flex-basis: 100%;
}
.lineup-editor__feedback:empty {
  display: none;
}
.lineup-editor__reset {
  margin-inline-start: auto;
}
.lineup-editor__danger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 24px;
}
.lineup-editor__danger h2 {
  font-size: var(--jp-font-size-body-sm);
  font-weight: var(--jp-font-weight-medium);
}
.lineup-editor__danger p {
  max-inline-size: 29rem;
  margin-block-start: 4px;
  font-size: var(--jp-font-size-caption);
}
.lineup-editor__delete {
  flex: none;
  --jp-color-button-ghost-fg: var(--jp-color-state-error-border);
  --jp-color-button-ghost-fg-hover: var(--jp-color-state-error-border);
}
.lineup-editor__preview {
  border-block-start: 1px solid var(--jp-color-border-subtle);
  padding-block: 16px;
  color: var(--jp-color-text-secondary);
  font-size: var(--jp-font-size-body-sm);
}
@media (width <= 48rem) {
  .lineup-editor {
    padding: 24px 16px;
  }
  .lineup-editor__fields {
    gap: 20px;
  }
  .lineup-editor__contact {
    grid-template-columns: minmax(0, 1fr);
  }
  .lineup-editor__danger {
    flex-wrap: wrap;
    gap: 8px;
  }
}
      </style>
      <jp-app-shell
        [sidebarCollapsed]="sidebarCollapsed()"
        [mobileNavOpen]="mobileNavOpen()"
        (sidebarCollapsedChange)="onSidebarCollapsedChange($event)"
        (mobileNavOpenChange)="onMobileNavOpenChange($event)"
      >
        <span jpAppShellBrand>Tampa Bay Rays</span>
      <nav jpAppShellSidebar>
          <jp-stack gap="2xs">
            <jp-app-shell-nav-item
              href="#settings"
              [active]="true"
              (click)="$event.preventDefault()"
            >
              <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              Settings
            </jp-app-shell-nav-item>
            <jp-app-shell-nav-item
              href="#profile"
              (click)="$event.preventDefault()"
            >
              <svg jpAppShellNavIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Player profile
            </jp-app-shell-nav-item>
          </jp-stack>
        </nav>

        <main jpAppShellMain>
<div class="lineup-editor">
  <header class="lineup-editor__header">
    <jp-heading as="h1">Lineup form</jp-heading>
    <p>Update the lineup and manager contact details.</p>
  </header>

  <form
    #lineupForm="ngForm"
    (ngSubmit)="save(lineupForm)"
    [attr.data-jp-density]="compact ? 'compact' : null"
  >
    <jp-card title="Manager contact">
    <div class="lineup-editor__fields">
      <p>The contact for this game's lineup.</p>
      <div class="lineup-editor__contact">
        <jp-input
          label="Email"
          type="email"
          placeholder="manager@rays.example"
          hint="Used for Rays club messages."
          [(ngModel)]="email"
          name="email"
        />
        <jp-select
          label="Club role"
          [options]="roleOptions"
          [(ngModel)]="role"
          name="role"
        />
      </div>
      <jp-textarea
        label="Manager notes"
        placeholder="Add lineup changes or reminders for the coaching staff."
        rows="3"
        [(ngModel)]="notes"
        name="notes"
      />
      <div class="lineup-editor__messages">
        <jp-checkbox [(ngModel)]="subscribe" name="subscribe">
          Get club messages
        </jp-checkbox>
        <p>Game changes and lineup updates from the Rays.</p>
      </div>
    </div>
    <div jpCardActions class="lineup-editor__footer">
      <jp-button variant="primary" type="submit">Save</jp-button>
      <jp-button variant="ghost" type="button" (click)="cancel(lineupForm)">Cancel</jp-button>
      <jp-button class="lineup-editor__reset" variant="ghost" type="button" (click)="reset(lineupForm)"
        >Reset</jp-button
      >
      <p class="lineup-editor__feedback" role="status">{{ feedback() }}</p>
    </div>
    </jp-card>
  </form>

  <section
    class="lineup-editor__danger"
    aria-labelledby="delete-lineup-heading"
  >
    <div>
      <h2 id="delete-lineup-heading">Delete lineup</h2>
      <p>
        Remove this game's saved lineup. Player profiles stay in the club
        roster.
      </p>
    </div>
    <jp-button class="lineup-editor__delete" variant="ghost" type="button" [disabled]="!saved()" (click)="deleteLineup(lineupForm)"
      >Delete lineup</jp-button
    >
  </section>

  <jp-disclosure class="lineup-editor__preview" title="Preview settings">
    <jp-switch [(ngModel)]="compact" name="compact">Compact density</jp-switch>
  </jp-disclosure>
</div>

        </main>
      </jp-app-shell>
    `,
    };
  },
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
      await userEvent.type(email, 'manager@rays.example');
      await expect(email.value).toBe('manager@rays.example');
      email.blur();
      await expect(email).not.toHaveFocus();
    }
  },
};
