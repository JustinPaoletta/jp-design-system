import { execFileSync } from 'node:child_process';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const artifacts = path.join(root, 'dist/packages');
const temporary = await mkdtemp(
  path.join(os.tmpdir(), 'jp-design-system-consumer-'),
);
const report = {
  passed: false,
  angular: require('@angular/core/package.json').version,
};
const run = (command, args, cwd = temporary, capture = false) =>
  execFileSync(command, args, {
    cwd,
    env: { ...process.env, CI: 'true', NG_CLI_ANALYTICS: 'false' },
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
  });
const json = (name, value) =>
  writeFile(path.join(temporary, name), `${JSON.stringify(value, null, 2)}\n`);
const versions = (names) =>
  Object.fromEntries(
    names.map((name) => [name, require(`${name}/package.json`).version]),
  );
try {
  await mkdir(artifacts, { recursive: true });
  const tarballs = {};
  for (const name of ['tokens', 'ui']) {
    await access(path.join(artifacts, name, 'package.json'));
    const packed = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--pack-destination', temporary],
        path.join(artifacts, name),
        true,
      ),
    )[0];
    tarballs[name] = `file:./${packed.filename}`;
    if (
      packed.files.some(({ path: file }) =>
        /\.spec\.|\.stories\.|src\//.test(file),
      )
    ) {
      throw new Error(`${name} tarball includes development sources`);
    }
    if (!packed.files.some(({ path: file }) => file.endsWith('.d.ts'))) {
      throw new Error(`${name} tarball lacks declarations`);
    }
    if (
      name === 'tokens' &&
      !packed.files.some(({ path: file }) => file === 'tokens.css')
    ) {
      throw new Error('Token tarball lacks public stylesheet');
    }
  }
  await json('package.json', {
    name: 'jp-design-system-external-consumer-smoke',
    version: '0.0.0',
    private: true,
    dependencies: {
      ...versions([
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/forms',
        '@angular/platform-browser',
        'rxjs',
        'tslib',
      ]),
      '@jp-design-system/tokens': tarballs.tokens,
      '@jp-design-system/ui': tarballs.ui,
    },
    devDependencies: versions([
      '@angular-devkit/architect',
      '@angular-devkit/core',
      '@angular/build',
      '@angular/compiler-cli',
      'typescript',
    ]),
  });
  await json('angular.json', {
    version: 1,
    projects: {
      consumer: {
        projectType: 'application',
        root: '',
        sourceRoot: 'src',
        architect: {
          build: {
            builder: '@angular/build:application',
            options: {
              browser: 'src/main.ts',
              index: 'src/index.html',
              tsConfig: 'tsconfig.json',
              outputPath: 'dist/consumer',
              outputHashing: 'none',
              styles: ['src/styles.css'],
            },
          },
        },
      },
    },
  });
  await json('tsconfig.json', {
    compilerOptions: {
      target: 'ES2022',
      module: 'preserve',
      moduleResolution: 'bundler',
      strict: true,
      experimentalDecorators: true,
      skipLibCheck: true,
      lib: ['ES2022', 'DOM'],
    },
    angularCompilerOptions: { strictTemplates: true },
    files: ['src/main.ts'],
  });
  await mkdir(path.join(temporary, 'src'));
  await writeFile(
    path.join(temporary, 'src/index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>JP package smoke</title><base href="/"></head><body><smoke-root></smoke-root></body></html>',
  );
  await writeFile(
    path.join(temporary, 'src/styles.css'),
    '@import "@jp-design-system/tokens/tokens.css";\n@import "@jp-design-system/tokens/tokens.compact.css";\n',
  );
  await writeFile(
    path.join(temporary, 'src/main.ts'),
    `
import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  JpButton, JpInput, JpCheckbox, JpRadioGroup, JpCombobox, JpProgress,
  JpTable, JpTabs, JpTabPanel,
  JpIcon, JpLink, JpDivider, JpDisclosure, JpAccordion,
  JpAvatar, JpAvatarGroup, JpStatusDot, JpSpinner, JpMeter, JpKeyboardHint,
  JpDescriptionList, JpCard, JpPageHeader, JpList, JpListItemTemplate,
  JpFormField, JpFieldControl, JpFormSection, JpErrorSummary,
  JpBanner, JpDrawer, JpCheckboxGroup, JpSegmentedControl, JpMultiSelect,
  JpSearchField, JpPasswordField, JpVisuallyHidden,
  JpChecklist, JpStepper, JpNumberStepper, JpSlider, JpRangeSlider,
  JpTimeline, JpCodeBlock, JpInlineCode, JpCopyButton, JpOverflowChip,
  JpCommandPalette, JpContextMenu, JpDatePicker, JpDateRangePicker, JpTimePicker,
  JpFileUpload, JpNotificationList, JpButtonGroup, JpToggleButton, JpSplitButton,
  JpInlineEdit, JpSkipLink, JpLiveAnnouncer,
  JpMedia, JpSplitPane, JpTableRowDetail, parseJpTablePreferences,
  JpTreeView, JpTreeTable, JpSchedulingCalendar, JpReorder, JpReorderContent,
  JpCarousel, JpCarouselSlide, JpChart, JpVirtualTable,
  JpAnnouncer, type JpUploadItem, type JpDateRangeValue,
  type JpRadioOption, type JpComboboxOption, type JpSortableTableColumn,
  type JpTableCellValue, type JpTableRowKey, type JpTableSort, type JpTab,
} from '@jp-design-system/ui';
import { JP_DEFAULT_ACCENT, type JpAccentFamily } from '@jp-design-system/tokens';
@Component({
  selector: 'smoke-root',
  imports: [
    JpButton, JpInput, JpCheckbox, JpRadioGroup, JpCombobox, JpProgress,
    JpTable, JpTabs, JpTabPanel, FormsModule, ReactiveFormsModule,
    JpIcon, JpLink, JpDivider, JpDisclosure, JpAccordion,
    JpAvatar, JpAvatarGroup, JpStatusDot, JpSpinner, JpMeter, JpKeyboardHint,
    JpDescriptionList, JpCard, JpPageHeader, JpList, JpListItemTemplate,
    JpFormField, JpFieldControl, JpFormSection, JpErrorSummary,
    JpBanner, JpDrawer, JpCheckboxGroup, JpSegmentedControl, JpMultiSelect,
    JpSearchField, JpPasswordField, JpVisuallyHidden,
    JpChecklist, JpStepper, JpNumberStepper, JpSlider, JpRangeSlider,
    JpTimeline, JpCodeBlock, JpInlineCode, JpCopyButton, JpOverflowChip,
  JpCommandPalette, JpContextMenu, JpDatePicker, JpDateRangePicker, JpTimePicker,
  JpFileUpload, JpNotificationList, JpButtonGroup, JpToggleButton, JpSplitButton,
  JpInlineEdit, JpSkipLink, JpLiveAnnouncer, JpMedia, JpSplitPane, JpTableRowDetail,
  JpTreeView, JpTreeTable, JpSchedulingCalendar, JpReorder, JpReorderContent,
  JpCarousel, JpCarouselSlide, JpChart, JpVirtualTable,
  ],
  template: \`
    <main [attr.data-jp-accent]="accent">
      <jp-page-header title="Package consumer"><span jpPageMeta>Preview</span></jp-page-header>
      <a jpLink href="#settings">Settings</a><jp-icon name="check" label="Complete" />
      <jp-divider decorative /><jp-keyboard-hint [keys]="['Control', 'K']" />
      <jp-avatar name="Package Consumer" /><jp-avatar-group label="Reviewers" [people]="people" [max]="1" />
      <jp-status-dot tone="success" label="Online" /><jp-spinner label="Refreshing" />
      <jp-meter label="Storage" [value]="40" />
      <jp-card title="Details"><jp-description-list [items]="details" /><button jpCardActions type="button">Edit</button></jp-card>
      <jp-list [items]="listItems"><ng-template jpListItem let-item><span>{{ item.title }}</span></ng-template></jp-list>
      <jp-accordion id="consumer-settings" label="Settings"><jp-disclosure title="Advanced">Details</jp-disclosure></jp-accordion>
      <jp-form-section legend="Preferences"><jp-form-field controlId="consumer-native" label="Native field"><input jpFieldControl /></jp-form-field></jp-form-section>
      <jp-error-summary [errors]="fieldErrors" />
      <jp-banner title="Preview" message="Ready for integration testing" />
      <jp-drawer title="Details" [open]="drawerOpen" (openChange)="drawerOpen = $event"><button jpDrawerActions type="button">Done</button></jp-drawer>
      <jp-checkbox-group label="Access" [options]="ownerOptions" [(ngModel)]="memberValues" />
      <jp-segmented-control label="Owner" [options]="ownerOptions" [(ngModel)]="segment" />
      <jp-multi-select label="Members" [options]="ownerOptions" [(ngModel)]="memberValues" />
      <jp-search-field label="Search" [(ngModel)]="query" />
      <jp-password-field label="Password" [(ngModel)]="password" />
      <span jpVisuallyHidden>Accessible extra context</span>
      <jp-checklist label="Tasks" [items]="[{id:'task',label:'Task'}]" [(ngModel)]="memberValues" />
      <jp-stepper label="Setup" currentId="details" [steps]="[{id:'details',label:'Details'}]" />
      <jp-number-stepper label="Seats" [min]="1" [max]="10" [(ngModel)]="numericValue" />
      <jp-slider label="Volume" [(ngModel)]="numericValue" />
      <jp-range-slider label="Budget" [(ngModel)]="rangeValue" />
      <jp-timeline label="Activity" [events]="[{id:'created',title:'Created'}]" />
      <code jpInlineCode>Example</code><jp-code-block label="Example code" code="const value = 1;" />
      <jp-copy-button text="Example" /><jp-overflow-chip label="Other items" [items]="[{id:'extra',label:'Extra'}]" />
      <jp-date-picker label="Date" [(ngModel)]="dateValue" min="2026-10-01" max="2026-10-31" />
      <jp-date-range-picker label="Dates" [(ngModel)]="dateRangeValue" />
      <jp-time-picker label="Time" [(ngModel)]="timeValue" [step]="900" />
      <jp-toggle-button label="Favorite" [(ngModel)]="accepted" />
      <jp-button-group label="Actions"><button type="button">Save</button></jp-button-group>
      <jp-split-button label="Create" [actions]="[{id:'template',label:'From template'}]" />
      <jp-context-menu label="Project" [actions]="[{id:'rename',label:'Rename'}]">Project</jp-context-menu>
      <jp-command-palette [commands]="[{id:'home',label:'Home'}]" />
      <jp-inline-edit label="Name" [value]="name" (valueChange)="name=$event" [save]="saveInline" />
      <jp-file-upload label="Files" [items]="uploadItems" />
      <jp-notification-list label="Inbox" [items]="[{id:'review',title:'Review',unread:true}]" />
      <jp-skip-link target="consumer-native" /><jp-live-announcer />
      <jp-media src="/image.svg" alt="Architecture" caption="Package preview" />
      <jp-split-pane id="consumer-split" primaryLabel="Overview" secondaryLabel="Detail" [(size)]="paneSize">
        <p jpSplitPrimary>Overview</p><p jpSplitSecondary>Detail</p>
      </jp-split-pane>
      <jp-table id="consumer-advanced-table" caption="Advanced table" [columns]="columns" [rows]="rows"
        columnChooser resizable stickyHeader stickyFirstColumn [visibleColumnKeys]="preferences.visibleColumnKeys"
        [columnWidths]="preferences.columnWidths" [expandedKeys]="selectedKeys" (expandedKeysChange)="selectedKeys=$event">
        <ng-template jpTableRowDetail let-row>{{ row.name }}</ng-template>
      </jp-table>
      <jp-tree-view id="consumer-tree" label="Assets" [nodes]="treeNodes" />
      <jp-tree-table id="consumer-tree-table" caption="Projects" nameHeader="Project" [columns]="[{key:'owner',header:'Owner'}]" [rows]="treeRows" />
      <jp-scheduling-calendar label="Appointments" [date]="dateValue" [events]="[]" timeZone="UTC" />
      <jp-reorder id="consumer-priorities" label="Priorities" [items]="[{id:'one',label:'First'},{id:'two',label:'Second'}]">
        <ng-template jpReorderContent let-item>{{ item.label }}</ng-template>
      </jp-reorder>
      <jp-carousel id="consumer-carousel" label="Reference">
        <ng-template jpCarouselSlide="first" label="First card"><p>First</p></ng-template>
        <ng-template jpCarouselSlide="second" label="Second card"><p>Second</p></ng-template>
      </jp-carousel>
      <jp-chart id="consumer-chart" label="Delivery" [labels]="['April','May']" [series]="[{id:'team',label:'Team',values:[12,18]}]" />
      <jp-virtual-table label="Inventory" [columns]="columns" [rows]="rows" [selectedKeys]="selectedKeys" />
      <jp-input label="Template-driven name" [(ngModel)]="name" />
      <jp-checkbox label="Accept terms" [(ngModel)]="accepted" [indeterminate]="true" />
      <form [formGroup]="form">
        <jp-input label="Project name" formControlName="project" required autocomplete="organization" />
        <jp-radio-group label="Visibility" formControlName="visibility" [options]="visibilityOptions" required />
        <jp-combobox label="Owner" formControlName="owner" [options]="ownerOptions" [loading]="false" required />
        <jp-checkbox label="Notifications" formControlName="notifications" />
        <jp-button type="submit" [loading]="saving" loadingLabel="Saving project" [disabled]="form.invalid">Save</jp-button>
      </form>
      <jp-progress label="Import progress" [value]="40" [max]="100" valueText="40 of 100 rows" />
      <jp-tabs ariaLabel="Project details" [tabs]="tabs" [(selectedValue)]="activeTab">
        <ng-template jpTabPanel="members">
          <jp-table caption="Project members" [columns]="columns" [rows]="rows" rowKey="id"
            [selectable]="true" [selectedKeys]="selectedKeys" (selectionChange)="selectedKeys = $event"
            [sort]="sort" (sortChange)="sort = $event" />
        </ng-template>
        <ng-template jpTabPanel="settings">Project settings</ng-template>
      </jp-tabs>
    </main>
  \`,
})
class ConsumerApp {
  readonly announcer = inject(JpAnnouncer);
  readonly uploadItems: readonly JpUploadItem[] = [];
  dateValue = '2026-10-10';
  dateRangeValue: JpDateRangeValue = ['2026-10-10', '2026-10-12'];
  timeValue = '09:00';
  readonly saveInline = async (_value: string, _signal: AbortSignal): Promise<void> => undefined;
  readonly people = [{ id: 'one', name: 'Package Consumer' }, { id: 'two', name: 'Reviewer' }];
  readonly details = [{ term: 'Region', description: 'us-east-1' }];
  readonly listItems = [{ id: 'one', title: 'Package consumer' }];
  readonly fieldErrors = [{ controlId: 'consumer-native', message: 'Enter a value' }];
  drawerOpen = false;
  memberValues: readonly string[] = [];
  numericValue: number | null = 3;
  rangeValue: readonly [number, number] = [10, 30];
  segment = 'justin';
  query = '';
  password = '';
  accent: JpAccentFamily = JP_DEFAULT_ACCENT;
  name = 'Package consumer';
  accepted = false;
  saving = false;
  readonly form = new FormGroup({
    project: new FormControl('Smoke project', { nonNullable: true, validators: [Validators.required] }),
    visibility: new FormControl('private', { nonNullable: true }),
    owner: new FormControl('justin', { nonNullable: true }),
    notifications: new FormControl(true, { nonNullable: true }),
  });
  readonly visibilityOptions: JpRadioOption[] = [
    { value: 'private', label: 'Private' }, { value: 'team', label: 'Team' },
  ];
  readonly ownerOptions: JpComboboxOption[] = [
    { value: 'justin', label: 'Justin' }, { value: 'team', label: 'Team' },
  ];
  readonly columns: JpSortableTableColumn[] = [{ key: 'name', header: 'Member', sortable: true }];
  readonly rows: Record<string, JpTableCellValue>[] = [{ id: 'justin', name: 'Justin' }];
  selectedKeys: JpTableRowKey[] = [];
  sort: JpTableSort | null = null;
  readonly tabs: JpTab[] = [{ value: 'members', label: 'Members' }, { value: 'settings', label: 'Settings' }];
  activeTab = 'members';
  paneSize = 40;
  readonly preferences = parseJpTablePreferences(null, this.columns);
  readonly treeNodes = [{key:'root',label:'Root',children:[{key:'child',label:'Child'}]}];
  readonly treeRows = [{key:'root',label:'Root',cells:{owner:'Team'},children:[{key:'child',label:'Child',cells:{owner:'Team'}}]}];
}
bootstrapApplication(ConsumerApp).catch(console.error);
`,
  );
  // Exact installed workspace versions, real tarballs, no workspace aliases/symlinks.
  // Prefer cache; on cache miss use only the official registry.
  try {
    run('npm', [
      'install',
      '--offline',
      '--no-audit',
      '--no-fund',
      '--registry=https://registry.npmjs.org',
    ]);
  } catch {
    run('npm', [
      'install',
      '--no-audit',
      '--no-fund',
      '--registry=https://registry.npmjs.org',
    ]);
  }
  // This isolated consumer is not an Nx workspace; use its own Angular builder.
  const builder = path.join(temporary, 'build.mjs');
  await writeFile(
    builder,
    `import { Architect } from '@angular-devkit/architect';
import { WorkspaceNodeModulesArchitectHost } from '@angular-devkit/architect/node/index.js';
import { workspaces } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node/index.js';
const host = workspaces.createWorkspaceHost(new NodeJsSyncHost());
const { workspace } = await workspaces.readWorkspace('angular.json', host);
const architect = new Architect(new WorkspaceNodeModulesArchitectHost(workspace, process.cwd()));
const run = await architect.scheduleTarget({project: 'consumer', target: 'build'});
try { const result = await run.result; if (!result.success) process.exitCode = 1; }
finally { await run.stop(); }
`,
  );
  run(process.execPath, [builder]);
  const css = await readFile(
    path.join(temporary, 'dist/consumer/browser/styles.css'),
    'utf8',
  );
  if (!css.includes('--jp-'))
    throw new Error('Consumer output lacks bundled token CSS');
  run(process.execPath, [
    '--input-type=module',
    '-e',
    'import { JP_DEFAULT_ACCENT } from "@jp-design-system/tokens"; if (JP_DEFAULT_ACCENT !== "neon") throw new Error("Token ESM import failed")',
  ]);
  report.passed = true;
  console.log(
    `Isolated Angular ${report.angular} tarball consumer build passed.`,
  );
} catch (error) {
  report.error = error.message;
  throw error;
} finally {
  // Release the disposable install before writing the report. A full disk must
  // not make reporting throw before cleanup and strand the largest artifact.
  if (process.env.KEEP_CONSUMER_SMOKE === '1') {
    console.log(`Consumer retained for diagnosis: ${temporary}`);
  } else {
    await rm(temporary, { recursive: true, force: true });
  }
  await mkdir(artifacts, { recursive: true });
  await writeFile(
    path.join(artifacts, 'consumer-smoke.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
}
