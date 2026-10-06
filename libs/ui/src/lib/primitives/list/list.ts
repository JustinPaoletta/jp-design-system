import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
export interface JpListItem {
  id: string;
  title: string;
  description?: string;
  meta?: string;
}
@Directive({ selector: 'ng-template[jpListItem]' })
export class JpListItemTemplate {
  readonly template =
    inject<TemplateRef<{ $implicit: JpListItem }>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: JpListItemTemplate,
    _context: unknown,
  ): _context is { $implicit: JpListItem } {
    void _context;
    return true;
  }
}
@Component({
  selector: 'jp-list',
  imports: [NgTemplateOutlet],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JpList {
  readonly items = input.required<readonly JpListItem[]>();
  readonly itemTemplate = contentChild(JpListItemTemplate);
}
