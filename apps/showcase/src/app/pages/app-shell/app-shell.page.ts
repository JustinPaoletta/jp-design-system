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
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
  ];
  readonly sessionSeries = [
    { id: 'sessions', label: 'Falcons', values: [0, 0, 1, 1, 3, 3, 4, 4, 5] },
    { id: 'bears', label: 'Bears', values: [0, 1, 1, 1, 2, 2, 2, 3, 3] },
  ];
  readonly accent = this.theme.accent;
  readonly density = this.theme.density;
}
