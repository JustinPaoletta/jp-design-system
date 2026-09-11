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
import { injectDocumentTheme } from '../../shared/document-theme';

@Component({
  selector: 'app-shell-page',
  imports: [JpBox, JpStack, JpInline, JpGrid, JpSurface, JpText, JpHeading],
  templateUrl: './app-shell.page.html',
  styleUrl: './app-shell.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellPage {
  private readonly theme = injectDocumentTheme();

  readonly accent = this.theme.accent;
  readonly density = this.theme.density;
}
