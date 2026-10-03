import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  JpBox,
  JpButton,
  JpCheckbox,
  JpHeading,
  JpIconButton,
  JpInline,
  JpInput,
  JpSelect,
  JpStack,
  JpSurface,
  JpSwitch,
  JpText,
  JpTextarea,
} from '@jp-design-system/ui';
import { injectDocumentTheme } from '../../shared/document-theme';

@Component({
  selector: 'app-controls-page',
  imports: [
    FormsModule,
    JpBox,
    JpStack,
    JpInline,
    JpSurface,
    JpText,
    JpHeading,
    JpButton,
    JpIconButton,
    JpInput,
    JpTextarea,
    JpSelect,
    JpCheckbox,
    JpSwitch,
  ],
  templateUrl: './controls.page.html',
  styleUrl: './controls.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsPage {
  private readonly theme = injectDocumentTheme();

  email = '';
  notes = '';
  role = 'editor';
  subscribe = true;
  compact = false;

  readonly roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ];

  readonly accent = this.theme.accent;
  readonly density = this.theme.density;
}
