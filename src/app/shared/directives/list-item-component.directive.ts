import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appListItemComponent]'
})
export class ListItemComponentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
