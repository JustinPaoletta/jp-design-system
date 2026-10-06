import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { JpIcon } from '../icon/icon';
import { JP_DISCLOSURE_GROUP } from './disclosure-group';
@Component({
  selector: 'jp-disclosure',
  imports: [JpIcon],
  templateUrl: './disclosure.html',
  styleUrl: './disclosure.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpDisclosure {
  private readonly group = inject(JP_DISCLOSURE_GROUP, { optional: true });
  readonly title = input.required<string>();
  readonly open = model(false);
  readonly name = input<string | null>(null);
  readonly groupName = computed(() => this.name() ?? this.group?.() ?? null);
  onToggle(event: Event): void {
    this.open.set((event.target as HTMLDetailsElement).open);
  }
}
