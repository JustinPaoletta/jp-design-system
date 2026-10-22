import {
  GAME_SIX_INNINGS,
  GAME_SIX_SCORE_SERIES,
} from '@jp-design-system/ui/primitives/game-six.example';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JpChart } from '@jp-design-system/ui';
import { injectDocumentTheme } from '../../shared/document-theme';

@Component({
  selector: 'app-shell-page',
  imports: [JpChart],
  templateUrl: './app-shell.page.html',
  styleUrl: './app-shell.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellPage {
  private readonly theme = injectDocumentTheme();

  readonly sessionLabels = GAME_SIX_INNINGS;
  readonly sessionSeries = GAME_SIX_SCORE_SERIES;
  readonly accent = this.theme.accent;
  readonly density = this.theme.density;
}
