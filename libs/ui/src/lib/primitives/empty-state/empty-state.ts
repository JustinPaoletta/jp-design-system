import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'jp-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-empty-state',
    role: 'status',
  },
})
export class JpEmptyState {
  readonly title = input.required<string>();
  readonly description = input('');
}
