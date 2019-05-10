import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GearItem } from "src/app/core/models/gear-item.model";
import { MerchandiseService } from "src/app/core/services/merchandise/merchandise.service";
import { ROUTE_ANIMATIONS_ELEMENTS } from "src/app/core/animations/route.animations";
import { Router, ActivatedRoute } from "@angular/router";
import { PageEvent } from "@angular/material";
import {
  EventBusService,
  EmitEvent,
  Events
} from "src/app/core/services/event-bus/event-bus.service";
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";
import { Subscription } from "rxjs";

@Component({
  selector: "app-merchandise-list",
  templateUrl: "./merchandise-list.component.html",
  styleUrls: ["./merchandise-list.component.scss"]
})
export class MerchandiseListComponent implements OnInit {
  @ViewChild("gearUp") merchandiseCards: ElementRef;

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  gearItems: GearItem[] = [];
  pagedGearItems: GearItem[] = [];

  breakpoint: number = 3;
  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6, 12, 18, 25];
  pageEvent: PageEvent;

  isSticky: boolean = false;
  scrollingSubscription: Subscription;

  constructor(
    private merchandiseService: MerchandiseService,
    private router: Router,
    private eventbus: EventBusService,
    private route: ActivatedRoute,
    private scroll: ScrollDispatcher
  ) {}

  ngOnInit() {
    this.eventbus.emit(new EmitEvent(Events.StickyHeader, this.isSticky));

    this.merchandiseService
      .fetchAllGearItems()
      .subscribe((gearItems: GearItem[]) => (this.gearItems = gearItems));

    // Currently not used
    //this.breakpoint = (window.innerWidth <= 800) ? 1 : 3;
    this.pagedGearItems = this.gearItems.slice(0, this.pageSize);
    this.length = this.gearItems.length;

    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.onWindowScroll(data);
      });
  }

  ngOnDestroy() {
    this.eventbus.emit(new EmitEvent(Events.StickyHeader, !this.isSticky));
    this.eventbus.emit(new EmitEvent(Events.HideToolbar, false));
    this.scrollingSubscription.unsubscribe();
  }

  onWindowScroll(data: CdkScrollable) {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
    if (scrollTop > 280) {
      this.eventbus.emit(new EmitEvent(Events.HideToolbar, true));
    } else if (scrollTop < 280) {
      this.eventbus.emit(new EmitEvent(Events.HideToolbar, false));
    }
  }

  onArrowClick() {
    const targetELement = this.merchandiseCards.nativeElement as HTMLElement;
    targetELement.scrollIntoView({ behavior: "smooth" });
  }

  onAddGearItems() {
    this.router.navigate([{ outlets: { modal: ["new"] } }], {
      relativeTo: this.route
    });
  }

  OnPageChange(event: PageEvent) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.pagedGearItems = this.gearItems.slice(startIndex, endIndex);
  }

  onResize(event) {
    //to adjust to screen size
    this.breakpoint = event.target.innerWidth <= 800 ? 1 : 3;
  }
}
