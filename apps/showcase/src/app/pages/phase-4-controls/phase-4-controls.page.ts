import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  JpAppShell,
  JpAppShellNavItem,
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

@Component({
  selector: 'app-phase-4-controls-page',
  imports: [
    FormsModule,
    JpAppShell,
    JpAppShellNavItem,
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
  templateUrl: './phase-4-controls.page.html',
  styleUrl: './phase-4-controls.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Phase4ControlsPage {
  sidebarCollapsed = false;
  mobileNavOpen = false;

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

  readonly accent =
    document.documentElement.getAttribute('data-jp-accent') ?? 'neon';
  readonly density =
    document.documentElement.getAttribute('data-jp-density') ?? 'default';
}
