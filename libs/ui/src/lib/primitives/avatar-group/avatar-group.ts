import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { JpAvatar } from '../avatar/avatar';
export interface JpAvatarPerson {
  id: string;
  name: string;
  src?: string;
}
@Component({
  selector: 'jp-avatar-group',
  imports: [JpAvatar],
  templateUrl: './avatar-group.html',
  styleUrl: './avatar-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpAvatarGroup {
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
}
