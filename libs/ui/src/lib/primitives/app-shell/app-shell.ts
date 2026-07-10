import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'jp-app-shell',
  imports: [CommonModule],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-app-shell',
    '[class.jp-app-shell--collapsed]': 'sidebarCollapsed()',
  },
})
export class JpAppShell {
  readonly sidebarCollapsed = input(false, { transform: booleanAttribute });

  readonly sidebarCollapsedChange = output<boolean>();

  toggleSidebar(): void {
    this.sidebarCollapsedChange.emit(!this.sidebarCollapsed());
  }
}
