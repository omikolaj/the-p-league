import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CdkScrollable } from "@angular/cdk/scrolling";

@Injectable({
  providedIn: "root"
})
export class HeaderService {
  isSticky$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hideToolbarHeader$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  sidenavText: string[] = ["Merchandise", "Gallery"];

  constructor() {}

  setStickyHeaderPosition(positionSticky: boolean) {
    this.isSticky$.next(positionSticky);
  }

  hideToolbar(hideToolbar: boolean): void {
    this.hideToolbarHeader$.next(hideToolbar);
  }

  onWindowScroll(data: CdkScrollable) {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
    if (scrollTop > 280) {
      this.hideToolbar(true);
    } else if (scrollTop < 280) {
      this.hideToolbar(false);
    }
  }
}
