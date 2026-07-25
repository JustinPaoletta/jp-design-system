import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  JpBox,
  JpGrid,
  JpHeading,
  JpInline,
  JpStack,
  JpSurface,
  JpText,
} from '@jp-design-system/ui';

@Component({
  selector: 'app-shell-page',
  imports: [JpBox, JpStack, JpInline, JpGrid, JpSurface, JpText, JpHeading],
  templateUrl: './app-shell.page.html',
  styleUrl: './app-shell.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellPage {
  readonly accent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly density =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';
}
