import { InjectionToken, inject, type Provider } from '@angular/core';

/**
 * Built-in user-visible copy. Sentence-shaped fields are functions so a
 * translation can reorder counts instead of concatenating English fragments.
 * Defaults match the English text the components rendered before this token
 * existed. Count functions receive raw numbers; they do not call Intl.
 */
export interface JpMessages {
  tree: {
    empty: string;
    loading: string;
    failed: string;
    retry: string;
    expand: (label: string) => string;
    collapse: (label: string) => string;
  };
  calendar: {
    previous: string;
    next: string;
    today: string;
    day: string;
    week: string;
    agenda: string;
    schedule: string;
    invalid: string;
    empty: string;
    loading: string;
    failed: string;
    retry: string;
    allDay: string;
    events: (count: number) => string;
    invalidEvents: (count: number) => string;
  };
  reorder: {
    moveUp: string;
    moveDown: string;
    pickUp: string;
    drop: string;
    cancel: string;
    empty: string;
    instructions: string;
    picked: (label: string) => string;
    moved: ({
      label,
      position,
      total,
    }: {
      label: string;
      position: number;
      total: number;
    }) => string;
    dropped: (label: string) => string;
    cancelled: (label: string) => string;
  };
  carousel: {
    previous: string;
    next: string;
    pause: string;
    play: string;
    empty: string;
    carouselRole: string;
    slideRole: string;
    chooseLabel: string;
    slide: ({ index, total }: { index: number; total: number }) => string;
    choose: (index: number) => string;
  };
  chart: {
    data: string;
    allHidden: string;
    category: string;
    empty: string;
    loading: string;
    failed: string;
    retry: string;
    invalid: string;
    series: string;
    value: string;
    missing: string;
  };
  virtualTable: {
    invalid: string;
    virtual: string;
    pages: string;
    previous: string;
    next: string;
    empty: string;
    loading: string;
    failed: string;
    retry: string;
    range: ({
      start,
      end,
      total,
    }: {
      start: number;
      end: number;
      total: number;
    }) => string;
  };
  media: { loading: string; error: string };
  actions: { more: string; skip: string };
  dates: {
    start: string;
    end: string;
    openCalendar: (label: string) => string;
    calendarLabel: (label: string) => string;
    previousMonth: string;
    nextMonth: string;
    formatHint: string;
    keyboardHint: string;
    openTimePicker: string;
    timePicker: string;
    hour: string;
    minute: string;
    second: string;
    invalidDate: string;
    noAvailableDates: string;
    requiredDate: string;
    requiredTime: string;
    invalidTime: string;
    timeConstraints: (constraints: {
      min: string;
      max: string;
      step: number | null;
    }) => string;
    invalidTimeOptions: string;
    apply: string;
    clear: string;
    close: string;
  };
  commands: { title: string; search: string; empty: string };
  inlineEdit: {
    edit: string;
    save: string;
    cancel: string;
    saving: string;
    saved: string;
    failed: string;
    empty: string;
  };
  upload: {
    chooseFile: string;
    result: (result: {
      name: string;
      status: string;
      error?: string;
    }) => string;
    chooseFiles: string;
    empty: string;
    queue: string;
    remove: string;
    cancel: string;
    retry: string;
    ready: string;
    uploading: string;
    complete: string;
    failed: string;
    typeError: (name: string) => string;
    sizeError: (name: string) => string;
    countError: (name: string) => string;
  };
  notifications: {
    all: string;
    unread: string;
    read: string;
    markRead: string;
    markUnread: string;
    dismiss: string;
    markAll: string;
    empty: string;
    emptyUnread: string;
    loading: string;
    retry: string;
  };
  checklist: {
    completed: (parts: { completed: number; total: number }) => string;
    empty: string;
  };
  stepper: { complete: string; error: string };
  numberStepper: { increase: string; decrease: string };
  rangeSlider: { lower: string; upper: string };
  timeline: { empty: string };
  copy: { action: string; pending: string; success: string; failure: string };
  overflow: { more: (count: number) => string };
  forms: {
    errorSummary: string;
    requiredValue: string;
    invalidValue: string;
    invalidEmail: string;
    invalidUrl: string;
    invalidRange: string;
    invalidStep: string;
    invalidLength: string;
    invalidFormat: string;
    clearSearch: string;
    showPassword: string;
    hidePassword: string;
  };
  banner: { dismiss: string };
  drawer: { close: string };
  pagination: {
    label: string;
    first: string;
    previous: string;
    next: string;
    last: string;
    range: (parts: { start: number; end: number; total: number }) => string;
    page: (parts: { page: number; pageCount: number }) => string;
  };
  dialog: {
    close: string;
  };
  toast: {
    dismiss: string;
  };
  table: {
    columns: string;
    details: string;
    expandRow: (label: string) => string;
    collapseRow: (label: string) => string;
    width: (label: string) => string;
    regionLabel: string;
    scrollHint: string;
    selectAll: string;
    selectRow: (label: string) => string;
    emptyTitle: string;
    /**
     * Appended to the column header when set. Empty by default so the sort
     * button's accessible name stays the header; `aria-sort` carries state.
     */
    sortAscending: string;
    sortDescending: string;
    sortNone: string;
  };
  tableToolbar: {
    label: string;
    activeFilters: string;
    clearFilters: string;
    selected: (count: number) => string;
    removeFilter: (label: string) => string;
  };
  combobox: {
    placeholder: string;
    loading: string;
    empty: string;
  };
  assistant: {
    title: string;
    conversation: string;
    newMessages: string;
    close: string;
    clearContext: string;
    composerLabel: string;
    send: string;
    pending: string;
    cancel: string;
    retry: string;
    cancelled: string;
    emptyTitle: string;
    emptyDescription: string;
    placeholder: string;
    responseFailed: string;
    roles: {
      user: string;
      assistant: string;
      system: string;
    };
  };
  appShell: {
    sidebarLabel: string;
    openNavigation: string;
    closeNavigation: string;
    expandSidebar: string;
    collapseSidebar: string;
  };
  button: {
    loading: string;
  };
  progress: {
    loading: string;
  };
  breadcrumbs: {
    label: string;
  };
  tabs: {
    label: string;
  };
  chip: {
    remove: (label: string) => string;
  };
}

export type JpMessagesOverride = {
  [K in keyof JpMessages]?: K extends 'assistant'
    ? Partial<Omit<JpMessages['assistant'], 'roles'>> & {
        roles?: Partial<JpMessages['assistant']['roles']>;
      }
    : Partial<JpMessages[K]>;
};

export const JP_DEFAULT_MESSAGES: JpMessages = {
  tree: {
    empty: 'No items',
    loading: 'Loading items…',
    failed: 'Could not load items',
    retry: 'Retry',
    expand: (label) => `Expand ${label}`,
    collapse: (label) => `Collapse ${label}`,
  },
  calendar: {
    previous: 'Previous',
    next: 'Next',
    today: 'Today',
    day: 'Day',
    week: 'Week',
    agenda: 'Agenda',
    schedule: 'Schedule',
    invalid: 'Check the date, locale, and time zone.',
    empty: 'No appointments',
    loading: 'Loading appointments…',
    failed: 'Could not load appointments',
    retry: 'Retry',
    allDay: 'All day',
    events: (count) =>
      `${count} ${count === 1 ? 'appointment' : 'appointments'}`,
    invalidEvents: (count) =>
      `${count} appointments could not be displayed. Check their dates and identifiers.`,
  },
  reorder: {
    moveUp: 'Move up',
    moveDown: 'Move down',
    pickUp: 'Reorder',
    drop: 'Drop',
    cancel: 'Cancel',
    empty: 'No items',
    instructions:
      'Press Space to pick up an item, use arrow keys to move it, then Space to drop or Escape to cancel.',
    picked: (label) => `Picked up ${label}`,
    moved: ({ label, position, total }) =>
      `${label}, position ${position} of ${total}`,
    dropped: (label) => `Dropped ${label}`,
    cancelled: (label) => `Cancelled reordering ${label}`,
  },
  carousel: {
    previous: 'Previous slide',
    next: 'Next slide',
    pause: 'Pause rotation',
    play: 'Start rotation',
    empty: 'No slides',
    carouselRole: 'carousel',
    slideRole: 'slide',
    chooseLabel: 'Choose slide',
    slide: ({ index, total }) => `Slide ${index} of ${total}`,
    choose: (index) => `Go to slide ${index}`,
  },
  chart: {
    data: 'View chart data',
    allHidden: 'All series are hidden. Select a series to show its data.',
    category: 'Inspect category',
    empty: 'No chart data',
    loading: 'Loading chart…',
    failed: 'Chart unavailable',
    retry: 'Retry',
    invalid: 'Check chart labels, series identifiers, and numeric values.',
    series: 'Series',
    value: 'Value',
    missing: 'No value',
  },
  virtualTable: {
    invalid:
      'Rows must have unique identifiers and columns must have unique keys.',
    virtual: 'Scrollable rows',
    pages: 'Paginated rows',
    previous: 'Previous page',
    next: 'Next page',
    empty: 'No rows',
    loading: 'Loading rows…',
    failed: 'Could not load rows',
    retry: 'Retry',
    range: ({ start, end, total }) => `${start}–${end} of ${total} rows`,
  },
  media: { loading: 'Loading image…', error: 'Image unavailable' },
  actions: { more: 'More actions', skip: 'Skip to content' },
  dates: {
    start: 'Start date',
    end: 'End date',
    openCalendar: (label) => (label ? `Choose ${label}` : 'Choose date'),
    calendarLabel: (label) => (label ? `${label} calendar` : 'Choose date'),
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    formatHint: 'YYYY-MM-DD',
    keyboardHint:
      'Use arrow keys to move between dates. Press Enter to select.',
    openTimePicker: 'Choose time',
    timePicker: 'Choose time',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    invalidDate: 'Enter a valid date within the allowed range and step.',
    noAvailableDates: 'No dates are available in this month.',
    requiredDate: 'Enter a date.',
    requiredTime: 'Enter a time.',
    invalidTime: 'Enter a valid time within the allowed range and step.',
    timeConstraints: ({ min, max, step }) => {
      const range = `Choose a time from ${min} to ${max}.`;
      if (step === null) return range;
      const minutes = step % 60 === 0;
      const count = minutes ? step / 60 : step;
      const unit = minutes ? 'minute' : 'second';
      return `${range} Use ${count} ${unit} intervals from ${min}.`;
    },
    invalidTimeOptions:
      'Time options are unavailable. Check the allowed range and interval.',
    apply: 'Apply',
    clear: 'Clear',
    close: 'Close',
  },
  commands: {
    title: 'Commands',
    search: 'Search commands',
    empty: 'No commands found',
  },
  inlineEdit: {
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    saving: 'Saving…',
    saved: 'Saved',
    failed: 'Could not save. Try again.',
    empty: 'Not set',
  },
  upload: {
    chooseFile: 'Choose file',
    result: ({ name, status, error }) =>
      `${name}: ${status}${error ? `. ${error}` : ''}`,
    chooseFiles: 'Choose files',
    empty: 'No files selected',
    queue: 'Selected files',
    remove: 'Remove',
    cancel: 'Cancel upload',
    retry: 'Retry upload',
    ready: 'Ready',
    uploading: 'Uploading',
    complete: 'Uploaded',
    failed: 'Upload failed',
    typeError: (name) => name + ': unsupported file type',
    sizeError: (name) => name + ': file is too large',
    countError: (name) => name + ': file limit reached',
  },
  notifications: {
    all: 'All',
    unread: 'Unread',
    read: 'Read',
    markRead: 'Mark as read',
    markUnread: 'Mark as unread',
    dismiss: 'Dismiss',
    markAll: 'Mark all as read',
    empty: 'No notifications',
    emptyUnread: 'No unread notifications',
    loading: 'Loading notifications…',
    retry: 'Retry',
  },
  checklist: {
    completed: ({ completed, total }) => `${completed} of ${total} completed`,
    empty: 'No tasks',
  },
  stepper: { complete: 'Completed', error: 'Needs attention' },
  numberStepper: { increase: 'Increase', decrease: 'Decrease' },
  rangeSlider: { lower: 'Minimum', upper: 'Maximum' },
  timeline: { empty: 'No activity yet' },
  copy: {
    action: 'Copy',
    pending: 'Copying…',
    success: 'Copied',
    failure: 'Could not copy. Select and copy the text manually.',
  },
  overflow: { more: (count) => `Show ${count} more items` },
  forms: {
    errorSummary: 'There is a problem',
    requiredValue: 'Complete this field.',
    invalidValue: 'Enter a valid value.',
    invalidEmail: 'Enter a valid email address.',
    invalidUrl: 'Enter a valid URL.',
    invalidRange: 'Enter a value within the allowed range.',
    invalidStep: 'Enter a value that matches the allowed step.',
    invalidLength: 'Check the value length.',
    invalidFormat: 'Use the required format.',
    clearSearch: 'Clear search',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
  banner: { dismiss: 'Dismiss banner' },
  drawer: { close: 'Close panel' },
  pagination: {
    label: 'Table pagination',
    first: 'First page',
    previous: 'Previous',
    next: 'Next',
    last: 'Last page',
    range: ({ start, end, total }) => `${start}–${end} of ${total}`,
    page: ({ page, pageCount }) => `Page ${page} of ${pageCount}`,
  },
  dialog: {
    close: 'Close dialog',
  },
  toast: {
    dismiss: 'Dismiss notification',
  },
  table: {
    columns: 'Columns',
    details: 'Details',
    expandRow: (label) => `Show details: ${label}`,
    collapseRow: (label) => `Hide details: ${label}`,
    width: (label) => `Width in pixels: ${label}`,
    regionLabel: 'Data table',
    scrollHint: 'Scroll horizontally to view more columns.',
    selectAll: 'Select all rows on this page',
    selectRow: (label) => `Select ${label}`,
    emptyTitle: 'No data',
    sortAscending: '',
    sortDescending: '',
    sortNone: '',
  },
  tableToolbar: {
    label: 'Table controls',
    activeFilters: 'Active filters',
    clearFilters: 'Clear filters',
    selected: (count) => `${count} selected`,
    removeFilter: (label) => `Remove filter: ${label}`,
  },
  combobox: {
    placeholder: 'Search options',
    loading: 'Loading options…',
    empty: 'No results found.',
  },
  assistant: {
    title: 'JP Assistant',
    conversation: 'Conversation',
    newMessages: 'Show new messages',
    close: 'Close assistant',
    clearContext: 'Clear context',
    composerLabel: 'Message the assistant',
    send: 'Send',
    pending: 'Generating response',
    cancel: 'Stop response',
    retry: 'Retry',
    cancelled: 'Response stopped',
    emptyTitle: 'Ask about this surface',
    emptyDescription:
      'Open the assistant from a context trigger, then send a question.',
    placeholder: 'Ask a question…',
    responseFailed: 'Response failed',
    roles: {
      user: 'You',
      assistant: 'Assistant',
      system: 'System',
    },
  },
  appShell: {
    sidebarLabel: 'Primary',
    openNavigation: 'Open navigation',
    closeNavigation: 'Close navigation',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',
  },
  button: {
    loading: 'Loading',
  },
  progress: {
    loading: 'Loading',
  },
  breadcrumbs: {
    label: 'Breadcrumb',
  },
  tabs: {
    label: 'Tabs',
  },
  chip: {
    remove: (label) => `Remove ${label}`,
  },
};

export function mergeJpMessages(
  base: JpMessages,
  overrides: JpMessagesOverride = {},
): JpMessages {
  return {
    tree: { ...base.tree, ...overrides.tree },
    calendar: { ...base.calendar, ...overrides.calendar },
    reorder: { ...base.reorder, ...overrides.reorder },
    carousel: { ...base.carousel, ...overrides.carousel },
    chart: { ...base.chart, ...overrides.chart },
    virtualTable: { ...base.virtualTable, ...overrides.virtualTable },
    media: { ...base.media, ...overrides.media },
    actions: { ...base.actions, ...overrides.actions },
    dates: { ...base.dates, ...overrides.dates },
    commands: { ...base.commands, ...overrides.commands },
    inlineEdit: { ...base.inlineEdit, ...overrides.inlineEdit },
    upload: { ...base.upload, ...overrides.upload },
    notifications: { ...base.notifications, ...overrides.notifications },
    checklist: { ...base.checklist, ...overrides.checklist },
    stepper: { ...base.stepper, ...overrides.stepper },
    numberStepper: { ...base.numberStepper, ...overrides.numberStepper },
    rangeSlider: { ...base.rangeSlider, ...overrides.rangeSlider },
    timeline: { ...base.timeline, ...overrides.timeline },
    copy: { ...base.copy, ...overrides.copy },
    overflow: { ...base.overflow, ...overrides.overflow },
    forms: { ...base.forms, ...overrides.forms },
    banner: { ...base.banner, ...overrides.banner },
    drawer: { ...base.drawer, ...overrides.drawer },
    pagination: { ...base.pagination, ...overrides.pagination },
    dialog: { ...base.dialog, ...overrides.dialog },
    toast: { ...base.toast, ...overrides.toast },
    table: { ...base.table, ...overrides.table },
    tableToolbar: { ...base.tableToolbar, ...overrides.tableToolbar },
    combobox: { ...base.combobox, ...overrides.combobox },
    assistant: {
      ...base.assistant,
      ...overrides.assistant,
      roles: {
        ...base.assistant.roles,
        ...overrides.assistant?.roles,
      },
    },
    appShell: { ...base.appShell, ...overrides.appShell },
    button: { ...base.button, ...overrides.button },
    progress: { ...base.progress, ...overrides.progress },
    breadcrumbs: { ...base.breadcrumbs, ...overrides.breadcrumbs },
    tabs: { ...base.tabs, ...overrides.tabs },
    chip: { ...base.chip, ...overrides.chip },
  };
}

export const JP_MESSAGES = new InjectionToken<JpMessages>('JP_MESSAGES', {
  providedIn: 'root',
  factory: () => mergeJpMessages(JP_DEFAULT_MESSAGES),
});

/** Merge `overrides` onto the parent token, or onto the English defaults. */
export function provideJpMessages(
  overrides: JpMessagesOverride = {},
): Provider {
  return {
    provide: JP_MESSAGES,
    useFactory: () =>
      mergeJpMessages(
        inject(JP_MESSAGES, { optional: true, skipSelf: true }) ??
          JP_DEFAULT_MESSAGES,
        overrides,
      ),
  };
}
