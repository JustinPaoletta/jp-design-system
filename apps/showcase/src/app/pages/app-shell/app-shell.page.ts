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
    { id: 'sessions', label: 'Dodgers', values: [0, 0, 0, 0, 5, 5, 5, 7, 7] },
    { id: 'bears', label: 'Yankees', values: [3, 4, 5, 5, 5, 6, 6, 6, 6] },
  ];
  readonly accent = this.theme.accent;
  readonly density = this.theme.density;
}
