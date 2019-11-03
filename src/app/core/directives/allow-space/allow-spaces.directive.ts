import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowSpaces]'
})
export class AllowSpacesDirective {
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
  }
  constructor() {}
}
