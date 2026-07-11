import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JpToast } from './toast';
import { JpToastService } from './toast.service';

@Component({
  selector: 'jp-toast-outlet',
  imports: [JpToast],
  templateUrl: './toast-outlet.html',
  styleUrl: './toast-outlet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'jp-toast-outlet',
    'aria-live': 'polite',
  },
})
export class JpToastOutlet {
  private readonly toastService = inject(JpToastService);

  readonly items = this.toastService.items;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
