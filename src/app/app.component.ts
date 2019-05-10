import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { trigger, transition } from "@angular/animations";
import { routeAnimations } from "./core/animations/route.animations";
import { Observable, Subscription } from "rxjs";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import {
  EventBusService,
  Events
} from "./core/services/event-bus/event-bus.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger("routeAnimations", [
      transition("AboutPage <=> TeamSignUpPage", routeAnimations),
      transition("* <=> MerchandiseListPage", routeAnimations)
    ])
  ]
})
export class AppComponent implements OnInit {
  title: string = "The P League";
  logo = "../../../../assets/logo.png";
  year = new Date().getFullYear();
  window: Element;
  subscription: Subscription;
  hideScrollbar: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private eventbus: EventBusService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const contentContainer =
          document.querySelector(".mat-sidenav-content") || this.window;
        contentContainer.scrollTo(0, 0);
      }
    });

    this.subscription = this.eventbus.on(
      Events.HideScrollbar,
      event => (this.hideScrollbar = event)
    );
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }
}
