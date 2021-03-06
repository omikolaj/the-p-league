import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EventBusService, Events } from 'src/app/core/services/event-bus/event-bus.service';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
	animations: [
		trigger('fadeHeader', [
			state('show', style({ transform: 'translateY(0%)', opacity: 1 })),
			state('hide', style({ transform: 'translateY(-100%)', opacity: 0 })),
			transition('show => hide', [
				style({ transform: 'translateY(0%)', opacity: 1 }),
				animate('.3s cubic-bezier(.08,-0.06,.44,.95)', style({ transform: 'translateY(-100%)', opacity: 0 }))
			]),
			transition('hide => show', [
				style({ transform: 'translateY(-100%)', opacity: 0 }),
				animate('.3s cubic-bezier(.08,-0.06,.44,.95)', style({ transform: 'translateY(0%)', opacity: 1 }))
			])
		])
	]
})
export class ToolbarComponent implements OnInit, OnDestroy {
	@Output() sidenavToggle = new EventEmitter();
	@Input() appTitle: string;
	@Input() logo: string;

	headerSubscription: Subscription;
	isSticky = true;
	hideToolBarHeader = false;
	headerLinksText: string[] = ['Merchandise', 'Gallery'];

	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
		map((result) => {
			return result.matches;
		})
	);

	constructor(
		private breakpointObserver: BreakpointObserver,
		private eventbus: EventBusService,
		private cdRef: ChangeDetectorRef,
		public authService: AuthService
	) {}

	ngOnInit() {
		this.headerSubscription = this.eventbus.on(Events.StickyHeader, (isSticky) => (this.isSticky = isSticky));

		this.headerSubscription.add(
			this.eventbus.onHideToolBar(Events.HideToolbar, (event: boolean) => {
				this.hideToolBarHeader = event;
				this.cdRef.detectChanges();
			})
		);
	}

	ngOnDestroy(): void {
		this.headerSubscription.unsubscribe();
	}

	onToggleSidenav(): void {
		this.sidenavToggle.emit();
	}
}
