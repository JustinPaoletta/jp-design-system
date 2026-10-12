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

  readonly sessionLabels = [
    '00:00',
    '03:00',
    '06:00',
    '09:00',
    '12:00',
    '15:00',
    '18:00',
    '18:30',
  ];
  readonly sessionSeries = [
    {
      id: 'sessions',
      label: 'Active sessions',
      values: [580, 760, 940, 1030, 1280, 1080, 1240, 1284],
    },
  ];
  readonly accent = this.theme.accent;
  readonly density = this.theme.density;
}
