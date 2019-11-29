import { transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { routeAnimations } from './core/animations/route.animations';
import { EventBusService, Events } from './core/services/event-bus/event-bus.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [
		trigger('routeAnimations', [
			transition('AboutPage <=> TeamSignUpPage', routeAnimations),
			transition('* <=> MerchandiseListPage', routeAnimations),
			transition('* <=> *', routeAnimations)
		])
	]
})
export class AppComponent implements OnInit {
	title = 'The P League';
	logo = '../../../../assets/logo.png';
	year = new Date().getFullYear();
	window: Element;
	subscription: Subscription;
	hideScrollbar = false;
	previousURL: string;
	currentURL = '';
	loading = false;

	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches));

	constructor(private breakpointObserver: BreakpointObserver, private router: Router, private eventbus: EventBusService) {}

	ngOnInit(): void {
		this.router.events.subscribe((event) => {
			this.checkRouterEvent(event);
			if (event instanceof NavigationEnd) {
				this.previousURL = this.currentURL;
				this.currentURL = event.url;
				if (event.url.includes('modal') || this.previousURL.includes('modal')) {
					return;
				}
				const contentContainer = document.querySelector('.mat-sidenav-content') || this.window;
				contentContainer.scrollTo(0, 0);
			}
		});

		this.subscription = this.eventbus.on(Events.HideScrollbar, (event: boolean) => (this.hideScrollbar = event));

		this.subscription.add(
			this.eventbus.on(Events.Loading, (event: boolean) => {
				return (this.loading = event);
			})
		);
	}

	prepareRoute(outlet: RouterOutlet) {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
	}

	checkRouterEvent(event): void {
		if (event instanceof NavigationStart) {
			this.loading = true;
		}
		if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
			this.loading = false;
		}
	}
}
