import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { JpAvatar } from '../avatar/avatar';
import { JP_MESSAGES } from '../../i18n';
import {
  JpPopover,
  JpPopoverContent,
  JpPopoverTrigger,
} from '../popover/popover';
export interface JpAvatarPerson {
  id: string;
  name: string;
  src?: string;
}
@Component({
  selector: 'jp-avatar-group',
  imports: [JpAvatar, JpPopover, JpPopoverContent, JpPopoverTrigger],
  templateUrl: './avatar-group.html',
  styleUrl: './avatar-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpAvatarGroup {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly messages = inject(JP_MESSAGES);
  readonly open = signal(false);
  private readonly restoreGroupFocus = signal(false);
  readonly overflowAriaLabel = input(this.messages.overflow.more);
  readonly people = input<readonly JpAvatarPerson[]>([]);
  readonly max = input(4);
  readonly label = input.required<string>();
  readonly overflowLabel = input<(count: number) => string>(
    (count) => `+${count}`,
  );
  readonly limit = computed(() =>
    Number.isFinite(this.max()) ? Math.max(1, Math.floor(this.max())) : 4,
  );
  readonly visible = computed(() => this.people().slice(0, this.limit()));
  readonly extra = computed(() =>
    Math.max(0, this.people().length - this.limit()),
  );
  readonly hiddenNames = computed(() =>
    this.people()
      .slice(this.limit())
      .map((person) => person.name)
      .join(', '),
  );
  constructor() {
    let wasOpen = false;
    effect(() => {
      if (this.extra()) return;
      const host = this.host.nativeElement;
      const disclosure = host.querySelector('jp-popover');
      if (disclosure?.contains(host.ownerDocument.activeElement)) {
        this.restoreGroupFocus.set(true);
      }
      this.open.set(false);
    });
    afterRenderEffect(() => {
      const isOpen = this.open() && this.extra() > 0;
      if (isOpen && !wasOpen) {
        this.host.nativeElement
          .querySelector<HTMLElement>('[jpPopoverContent]')
          ?.focus({ preventScroll: true });
      }
      if (this.restoreGroupFocus()) {
        const host = this.host.nativeElement;
        const active = host.ownerDocument.activeElement;
        if (active === host.ownerDocument.body || host.contains(active)) {
          host
            .querySelector<HTMLElement>('.group')
            ?.focus({ preventScroll: true });
        }
        this.restoreGroupFocus.set(false);
      }
      wasOpen = isOpen;
    });
  }
  setOpen(open: boolean): void {
    if (!open) {
      const host = this.host.nativeElement;
      const panel = host.querySelector('[jpPopoverContent]');
      if (panel?.contains(host.ownerDocument.activeElement)) {
        host
          .querySelector<HTMLElement>('[jpPopoverTrigger]')
          ?.focus({ preventScroll: true });
      }
    }
    this.open.set(open);
  }
}
