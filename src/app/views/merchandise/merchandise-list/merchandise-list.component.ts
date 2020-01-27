import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/core/animations/route.animations';
import { GearItem } from 'src/app/core/models/merchandise/gear-item.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DeviceInfoService } from 'src/app/core/services/device-info/device-info.service';
import { EmitEvent } from 'src/app/core/services/event-bus/EmitEvent';
import { EventBusService, Events } from 'src/app/core/services/event-bus/event-bus.service';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { PaginatorService } from 'src/app/core/services/paginator/paginator.service';
import { Role } from 'src/app/shared/constants/the-p-league-constants';

@Component({
	selector: 'app-merchandise-list',
	templateUrl: './merchandise-list.component.html',
	styleUrls: ['./merchandise-list.component.scss'],
	providers: [PaginatorService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MerchandiseListComponent implements OnInit, OnDestroy {
	@ViewChild('gearUp', { static: false }) merchandiseCards: ElementRef;
	@ViewChild('paginator', { static: true }) paginator: MatPaginator;

	routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
	gearItems: GearItem[] = [];
	pagedGearItems: GearItem[] = [];

	breakpoint = 3;
	length = 0;
	pageSize = 6;
	pageSizeOptions: number[] = [6, 12, 18, 24];
	pageEvent: PageEvent;

	isSticky = false;
	scrollingSubscription: Subscription;

	isAdmin = false;

	gearItems$ = combineLatest([
		this.merchandiseService.gearItems$,
		this.merchandiseService.updatedGearItems$,
		this.merchandiseService.newLatestGearItems$,
		this.merchandiseService.deleteGearItemsLatest$,
		this.merchandiseService.pageChangeAction
	]).pipe(
		map(([gearItems]) => {
			console.log('gearItems', gearItems);
			const pagedItems: GearItem[] = this.paginatorService.getPagedItems(
				[...gearItems],
				[...this.gearItems],
				[...this.pagedGearItems],
				this.pageSize,
				this.paginator
			);

			this.length = gearItems.length;
			this.gearItems = [...gearItems];
			this.pagedGearItems = pagedItems;
			return this.pagedGearItems;
		})
	);

	constructor(
		private merchandiseService: MerchandiseService,
		private router: Router,
		private eventbus: EventBusService,
		private route: ActivatedRoute,
		private scroll: ScrollDispatcher,
		private paginatorService: PaginatorService,
		public deviceInfo: DeviceInfoService,
		public authService: AuthService
	) {}

	ngOnInit(): void {
		this.isAdmin = this.route.snapshot.data.roles.includes(Role.Admin);

		this.eventbus.emit(new EmitEvent(Events.StickyHeader, this.isSticky));

		this.scrollingSubscription = this.scroll
			.scrolled()
			.pipe(
				scan<CdkScrollable, number[]>((stack, curr) => {
					const scrollNumber = curr.getElementRef().nativeElement.scrollTop;
					stack.push(scrollNumber);
					return stack.slice(stack.length - 2);
				}, new Array<number>())
			)
			.subscribe((data: number[]) => {
				this.onWindowScroll(data);
			});
	}

	ngOnDestroy(): void {
		this.eventbus.emit(new EmitEvent(Events.StickyHeader, !this.isSticky));
		this.eventbus.emit(new EmitEvent(Events.HideToolbar, false));
		this.scrollingSubscription.unsubscribe();
	}

	onWindowScroll(data: number[]): void {
		// Get the last element in the array which would be latest position added
		const scrollTop = data[data.length - 1] || 0;
		const secondLastItem = data[data.length - 2] || 0;
		// if last item is smaller than second last time show toolbar, means were scrolling UP
		if (scrollTop < secondLastItem) {
			this.eventbus.emit(new EmitEvent(Events.HideToolbar, false));
		} else if (scrollTop > 280) {
			this.eventbus.emit(new EmitEvent(Events.HideToolbar, true));
		} else if (scrollTop < 280) {
			this.eventbus.emit(new EmitEvent(Events.HideToolbar, false));
		}
	}

	onArrowClick(): void {
		const targetELement = this.merchandiseCards.nativeElement as HTMLElement;
		targetELement.scrollIntoView({ behavior: 'smooth' });
	}

	onAddGearItems(): void {
		this.router.navigate([{ outlets: { modal: ['new'] } }], {
			relativeTo: this.route
		});
	}

	OnPageChange(event: PageEvent): void {
		this.pageEvent = new PageEvent();

		this.pageSize = event.pageSize;
		const startIndex = event.pageIndex * event.pageSize;
		let endIndex = startIndex + event.pageSize;
		if (endIndex > this.length) {
			endIndex = this.length;
		}
		this.pagedGearItems = this.gearItems.slice(startIndex, endIndex);

		// Trigger the page change action
		this.merchandiseService.onPageChange();
	}

	onResize(event): void {
		// to adjust to screen size
		this.breakpoint = event.target.innerWidth <= 800 ? 1 : 3;
	}
}
