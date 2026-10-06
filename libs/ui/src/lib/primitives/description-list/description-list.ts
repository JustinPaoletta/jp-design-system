import { ChangeDetectionStrategy, Component, input } from '@angular/core';
export interface JpDescriptionItem {
  term: string;
  description: string | number;
}
@Component({
  selector: 'jp-description-list',

  templateUrl: './description-list.html',
  styleUrl: './description-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpDescriptionList {
  readonly items = input.required<readonly JpDescriptionItem[]>();
}
