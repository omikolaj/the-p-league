import { Injectable } from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { filter, map, pairwise } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EventBusService {
  private subject$ = new Subject();

  constructor() {}

  emit(event: EmitEvent) {
    this.subject$.next(event);
  }

  on(event: Events, action: any): Subscription {
    return this.subject$
      .pipe(
        filter((e: EmitEvent) => e.name === event),
        map((e: EmitEvent) => e.value)
      )
      .subscribe(action);
  }

  onHideToolBar(event: Events, action: any): Subscription {
    return this.subject$
      .pipe(
        filter((e: EmitEvent) => e.name === event),
        map((e: EmitEvent) => e.value),
        pairwise(),
        filter(headerState => {
          return !(
            (headerState[0] === false && headerState[1] === false) ||
            (headerState[0] === true && headerState[1] === true)
          );
        }),
        map(headerState => headerState[1])
      )
      .subscribe(action);
  }
}

export class EmitEvent {
  constructor(public name: any, public value?: any) {}
}

export enum Events {
  None,
  StickyHeader,
  HideScrollbar,
  HideToolbar
}
