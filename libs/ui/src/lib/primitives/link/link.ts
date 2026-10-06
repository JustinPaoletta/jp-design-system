import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'a[jpLink]',

  templateUrl: './link.html',
  styleUrl: './link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpLink {}
