import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  JpAnnouncer,
  JpButton,
  JpButtonGroup,
  JpCard,
  JpCheckbox,
  JpCommandPalette,
  JpContextMenu,
  JpDatePicker,
  JpDateRangePicker,
  JpErrorSummary,
  JpFileUpload,
  JpInlineEdit,
  JpLink,
  JpLiveAnnouncer,
  JpNotificationList,
  JpPageHeader,
  JpSkipLink,
  JpSplitButton,
  JpTimePicker,
  JpToggleButton,
  type JpCommand,
  type JpDateRangeValue,
  type JpNotification,
  type JpUploadAction,
  type JpUploadItem,
} from '@jp-design-system/ui';
@Component({
  selector: 'app-workflows-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    JpLink,
    JpButton,
    JpButtonGroup,
    JpCard,
    JpCheckbox,
    JpCommandPalette,
    JpContextMenu,
    JpDatePicker,
    JpDateRangePicker,
    JpErrorSummary,
    JpFileUpload,
    JpInlineEdit,
    JpLiveAnnouncer,
    JpNotificationList,
    JpPageHeader,
    JpSkipLink,
    JpSplitButton,
    JpTimePicker,
    JpToggleButton,
  ],
  templateUrl: './workflows.page.html',
  styleUrl: './workflows.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowsPage {
  private readonly announcer = inject(JpAnnouncer);
  private readonly injector = inject(Injector);
  readonly summary = viewChild(JpErrorSummary);
  readonly notificationRegion =
    viewChild<ElementRef<HTMLElement>>('notificationRegion');
  readonly commandOpen = signal(false);
  readonly action = signal('No action selected');
  readonly projectName = signal('Launch plan');
  failNextSave = true;
  readonly favorite = new FormControl(false);
  readonly launch = new FormControl('2026-10-10', { nonNullable: true });
  readonly dates = new FormControl<JpDateRangeValue>(
    ['2026-10-10', '2026-10-14'],
    { nonNullable: true },
  );
  readonly time = new FormControl('09:00', {
    nonNullable: true,
    validators: [Validators.required],
  });
  readonly submitted = signal(false);
  readonly scheduleSaved = signal(false);
  readonly commands: readonly JpCommand[] = [
    {
      id: 'overview',
      label: 'Open overview',
      section: 'Navigate',
      keywords: ['home', 'dashboard'],
    },
    {
      id: 'settings',
      label: 'Project settings',
      description: 'Manage this workspace',
      section: 'Navigate',
    },
    {
      id: 'duplicate',
      label: 'Duplicate project',
      section: 'Actions',
      shortcut: ['Mod', 'Shift', 'D'],
    },
    {
      id: 'archive',
      label: 'Archive project',
      section: 'Actions',
      disabled: true,
    },
  ];
  readonly menuActions = [
    { id: 'rename', label: 'Rename' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'archive', label: 'Archive', disabled: true },
  ];
  readonly uploads = signal<readonly JpUploadItem[]>([]);
  private nextFile = 0;
  readonly notifications = signal<readonly JpNotification[]>([
    {
      id: 'review',
      title: 'Review requested',
      description: 'Ada requested feedback on the launch plan.',
      group: 'Today',
      unread: true,
      timeLabel: '10:00 UTC',
      dateTime: '2026-10-04T10:00:00Z',
    },
    {
      id: 'release',
      title: 'Release notes ready',
      group: 'Today',
      unread: true,
      href: '#workflow-main',
    },
    {
      id: 'invite',
      title: 'Workspace invitation accepted',
      group: 'Earlier',
      unread: false,
      timeLabel: 'Yesterday',
    },
  ]);
  readonly saveName = (_value: string, signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
      const fail = this.failNextSave;
      this.failNextSave = false;
      const abort = () => {
        clearTimeout(timer);
        signal.removeEventListener('abort', abort);
        reject(new DOMException('Cancelled', 'AbortError'));
      };
      const timer = setTimeout(() => {
        signal.removeEventListener('abort', abort);
        if (fail) reject(new Error('Demo save failure'));
        else resolve();
      }, 250);
      if (signal.aborted) abort();
      else signal.addEventListener('abort', abort, { once: true });
    });
  record(id: string): void {
    this.action.set(id);
  }
  addFiles(files: readonly File[]): void {
    this.uploads.update((items) => [
      ...items,
      ...files.map((file) => ({
        id: 'upload-' + ++this.nextFile,
        file,
        status: 'ready' as const,
      })),
    ]);
  }
  uploadAction(action: JpUploadAction): void {
    if (action.type === 'remove')
      this.uploads.update((items) =>
        items.filter((item) => item.id !== action.id),
      );
    else
      this.uploads.update((items) =>
        items.map((item) =>
          item.id === action.id
            ? {
                ...item,
                status: action.type === 'retry' ? 'uploading' : 'ready',
                progress: action.type === 'retry' ? 25 : null,
                error: undefined,
              }
            : item,
        ),
      );
    this.announcer.announce('File action: ' + action.type);
  }
  uploadState(status: 'uploading' | 'complete' | 'error'): void {
    this.uploads.update((items) =>
      items.map((item) => ({
        ...item,
        status,
        progress: status === 'uploading' ? 40 : 100,
        error:
          status === 'error'
            ? 'Connection interrupted. Retry this file.'
            : undefined,
      })),
    );
  }
  changeRead(change: { id: string; unread: boolean }): void {
    this.notifications.update((items) =>
      items.map((item) =>
        item.id === change.id ? { ...item, unread: change.unread } : item,
      ),
    );
  }
  dismiss(id: string): void {
    this.notifications.update((items) =>
      items.filter((item) => item.id !== id),
    );
    afterNextRender(() => this.notificationRegion()?.nativeElement.focus(), {
      injector: this.injector,
    });
    this.announcer.announce('Notification dismissed');
  }
  markAll(): void {
    this.notifications.update((items) =>
      items.map((item) => ({ ...item, unread: false })),
    );
    this.announcer.announce('All notifications marked as read');
  }
  errors() {
    if (!this.submitted()) return [];
    return [
      ...(this.launch.invalid
        ? [
            {
              controlId: 'launch-date',
              message: 'Choose a launch date in October 2026.',
            },
          ]
        : []),
      ...(this.dates.invalid
        ? [
            {
              controlId: 'event-dates-start',
              message: 'Choose an ordered date range in October 2026.',
            },
          ]
        : []),
      ...(this.time.invalid
        ? [
            {
              controlId: 'event-time',
              message:
                'Choose a time between 09:00 and 17:00 in 15-minute steps.',
            },
          ]
        : []),
    ];
  }
  saveSchedule(): void {
    this.submitted.set(true);
    this.scheduleSaved.set(false);
    if (this.errors().length) {
      afterNextRender(() => this.summary()?.focus(), {
        injector: this.injector,
      });
      return;
    }
    this.scheduleSaved.set(true);
  }
}
