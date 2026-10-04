import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { JP_MESSAGES } from '../../i18n';
import { JpProgress } from '../progress/progress';
export interface JpUploadItem {
  id: string;
  file: File;
  status: 'ready' | 'uploading' | 'complete' | 'error';
  progress?: number | null;
  error?: string;
}
export interface JpUploadRejection {
  file: File;
  reason: 'type' | 'size' | 'count';
  message: string;
}
export interface JpUploadAction {
  id: string;
  type: 'remove' | 'cancel' | 'retry';
}
let nextUpload = 0;
@Component({
  selector: 'jp-file-upload',
  imports: [JpProgress],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'null' },
})
export class JpFileUpload {
  readonly messages = inject(JP_MESSAGES).upload;
  private readonly generatedId = 'jp-upload-' + ++nextUpload;
  readonly id = input('');
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
  readonly accept = input('');
  readonly multiple = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly maxFiles = input(10);
  readonly maxBytes = input<number | null>(null);
  readonly items = input<readonly JpUploadItem[]>([]);
  readonly filesSelected = output<readonly File[]>();
  readonly filesRejected = output<readonly JpUploadRejection[]>();
  readonly action = output<JpUploadAction>();
  readonly rejections = signal<readonly JpUploadRejection[]>([]);
  readonly resolvedId = computed(() => this.id() || this.generatedId);
  readonly describedBy = computed(
    () =>
      [
        this.hint() ? this.resolvedId() + '-hint' : '',
        this.error() || this.rejections().length
          ? this.resolvedId() + '-error'
          : '',
      ]
        .filter(Boolean)
        .join(' ') || null,
  );
  private accepts(file: File): boolean {
    const accepts = this.accept()
      .split(',')
      .map((t) => t.trim().toLocaleLowerCase())
      .filter(Boolean);
    if (!accepts.length) return true;
    const name = file.name.toLocaleLowerCase(),
      type = file.type.toLocaleLowerCase();
    return accepts.some((token) =>
      token.startsWith('.')
        ? name.endsWith(token)
        : token.endsWith('/*')
          ? type.startsWith(token.slice(0, -1))
          : type === token,
    );
  }
  select(event: Event): void {
    const control = event.target as HTMLInputElement;
    const files = Array.from(control.files ?? []);
    control.value = '';
    if (this.disabled()) return;
    this.validateSelection(files);
  }
  /** Exposed for adapters; normal UI uses the keyboard-accessible native picker. */
  validateSelection(files: readonly File[]): void {
    if (this.disabled()) return;
    const accepted: File[] = [],
      rejected: JpUploadRejection[] = [];
    const configured = Number.isFinite(this.maxFiles())
      ? Math.max(0, Math.floor(this.maxFiles()))
      : 10;
    const limit = this.multiple() ? configured : Math.min(1, configured);
    const room = Math.max(0, limit - this.items().length);
    const maxBytes = this.maxBytes();
    for (const file of files) {
      const reason = !this.accepts(file)
        ? 'type'
        : maxBytes !== null &&
            Number.isFinite(maxBytes) &&
            file.size > Math.max(0, maxBytes)
          ? 'size'
          : accepted.length >= room
            ? 'count'
            : null;
      if (reason)
        rejected.push({
          file,
          reason,
          message: (reason === 'type'
            ? this.messages.typeError
            : reason === 'size'
              ? this.messages.sizeError
              : this.messages.countError)(file.name),
        });
      else accepted.push(file);
    }
    this.rejections.set(rejected);
    if (rejected.length) this.filesRejected.emit(rejected);
    if (accepted.length) this.filesSelected.emit(accepted);
  }
  status(item: JpUploadItem): string {
    return this.messages[item.status === 'error' ? 'failed' : item.status];
  }
  act(item: JpUploadItem, type: JpUploadAction['type']): void {
    if (
      this.disabled() ||
      (type === 'cancel' && item.status !== 'uploading') ||
      (type === 'retry' && item.status !== 'error') ||
      (type === 'remove' && item.status === 'uploading')
    )
      return;
    this.action.emit({ id: item.id, type });
  }
}
