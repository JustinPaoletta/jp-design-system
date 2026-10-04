import { Directive } from '@angular/core';
/** Hides presentation while preserving content in the accessibility tree. */
@Directive({
  selector: '[jpVisuallyHidden]',
  host: {
    '[style.position]': '"absolute"',
    '[style.width]': '"1px"',
    '[style.height]': '"1px"',
    '[style.padding]': '"0"',
    '[style.border]': '"0"',
    '[style.overflow]': '"hidden"',
    '[style.clip-path]': '"inset(50%)"',
    '[style.white-space]': '"nowrap"',
  },
})
export class JpVisuallyHidden {}
