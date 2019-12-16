import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, flatMap, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SnackBarEvent, SnackBarService } from 'src/app/shared/components/snack-bar/snack-bar-service.service';
import { GearItem } from '../../models/merchandise/gear-item.model';
import { EmitEvent } from '../event-bus/EmitEvent';
import { EventBusService, Events } from '../event-bus/event-bus.service';

@Injectable({
	providedIn: 'root'
})
export class MerchandiseService implements Resolve<Observable<GearItem[]>> {
	constructor(public http: HttpClient, public snackBarService: SnackBarService, private eventBus: EventBusService, private router: Router) {}
	public readonly merchandiseUrl: string = 'merchandise';
	private updateGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<GearItem>(null);
	private addGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<GearItem>(null);
	private deleteGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<GearItem>(null);
	pageChangeAction: BehaviorSubject<{}> = new BehaviorSubject<{}>(null);

	protected loadingSubject = new Subject<boolean>();
	loading$ = this.loadingSubject.asObservable();

	// We need a separate loading for delete because otherwise if we trigger update loading or new
	// both the card individual loading bar will appear and the one in the dialog
	private loadingDeleteSubject = new Subject<boolean>();
	loadingDelete$ = this.loadingDeleteSubject.asObservable();

	gearItems$: Observable<GearItem[]> = new BehaviorSubject<GearItem[]>([]).asObservable();
	gearItems: GearItem[];

	updatedGearItems$ = combineLatest([this.updateGearItemAction, this.gearItems$]).pipe(
		switchMap(([updatedGearItem]) => {
			this.loadingSubject.next(true);
			return this.updateGearItemAsync(updatedGearItem);
		}),
		shareReplay()
	);

	newLatestGearItems$ = combineLatest([this.addGearItemAction, this.gearItems$]).pipe(
		switchMap(([newGearItem]) => {
			this.loadingSubject.next(true);
			return this.createGearItemAsync(newGearItem);
		}),
		shareReplay()
	);

	deleteGearItemsLatest$ = combineLatest([this.deleteGearItemAction, this.gearItems$]).pipe(
		switchMap(([gearItemToDelete]) => {
			return this.deleteGearItemAsync(gearItemToDelete);
		}),
		shareReplay()
	);

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
		this.gearItems$ = this.http.get<GearItem[]>(this.merchandiseUrl).pipe(
			map((gearItems: GearItem[]) => (this.gearItems = gearItems).reverse()),
			catchError(() => {
				this.router.navigate(['about']);
				this.snackBarService.openSnackBarFromComponent(`Error occured. Please come back later`, 'Dismiss', SnackBarEvent.Error);
				return of([]);
			}),
			shareReplay()
		);
		return this.gearItems$;
	}

	onPageChange() {
		return this.pageChangeAction.next({});
	}

	findGearItem(id: number): Observable<GearItem> {
		return this.gearItems$.pipe(
			flatMap((gearItems: GearItem[]) => {
				const item = gearItems.filter((gearItem: GearItem) => gearItem.id === id);
				return item;
			})
		);
	}

	updateGearItem(gearItem: GearItem) {
		this.updateGearItemAction.next(gearItem);
	}

	private updateGearItemAsync(gearItem: GearItem): Observable<GearItem[]> {
		if (gearItem === null) {
			return of([]);
		}
		return combineLatest([this.gearItems$, this.http.patch<GearItem>(`${this.merchandiseUrl}/${gearItem.id}`, gearItem.formData)]).pipe(
			map(([gearItems, updatedGearItem]: [GearItem[], GearItem]) => {
				const index: number = gearItems.map((gI: GearItem) => gI.id).indexOf(gearItem.id);
				if (index > -1) {
					gearItems.splice(index, 1, updatedGearItem);
				}
				return gearItems;
			}),
			tap((_) => {
				this.loadingSubject.next(false);
				this.snackBarService.openSnackBarFromComponent(`Successfully updated ${gearItem.name}`, 'Dismiss', SnackBarEvent.Success);
			}),
			tap(() => this.eventBus.emit(new EmitEvent(Events.CloseOpen, true))),
			catchError(() => {
				this.loadingSubject.next(false);
				this.snackBarService.openSnackBarFromComponent(`Error occured updating ${gearItem.name}`, 'Dismiss', SnackBarEvent.Error);
				return of([]);
			})
		);
	}

	createGearItem(gearItem: GearItem) {
		this.addGearItemAction.next(gearItem);
	}

	private createGearItemAsync(gearItem: GearItem): Observable<GearItem[]> {
		if (gearItem === null) {
			return of([]);
		}

		return combineLatest([this.gearItems$, this.http.post<GearItem>(`${this.merchandiseUrl}`, gearItem.formData)]).pipe(
			map(([gearItems, newGearItem]: [GearItem[], GearItem]) => {
				gearItems.unshift(newGearItem);
				return gearItems;
			}),
			tap((_) => {
				this.loadingSubject.next(false);
				this.snackBarService.openSnackBarFromComponent(`Successfully created ${gearItem.name}`, 'Dismiss', SnackBarEvent.Success);
			}),
			tap(() => this.eventBus.emit(new EmitEvent(Events.CloseOpen, true))),
			catchError(() => {
				this.loadingSubject.next(false);
				this.snackBarService.openSnackBarFromComponent(`Error occured creating ${gearItem.name}`, 'Dismiss', SnackBarEvent.Error);
				return of([]);
			})
		);
	}

	deleteGearItem(gearItem: GearItem) {
		this.deleteGearItemAction.next(gearItem);
	}

	private deleteGearItemAsync(gearItemToDelete: GearItem) {
		if (gearItemToDelete === null) {
			return of([]);
		}

		this.eventBus.emit(new EmitEvent(Events.Loading, true));

		return combineLatest([this.gearItems$, this.http.delete<void>(`${this.merchandiseUrl}/${gearItemToDelete.id}`)]).pipe(
			map(([gearItems]: [GearItem[], void]) => {
				const index: number = gearItems.map((gearItem: GearItem) => gearItem.id).indexOf(gearItemToDelete.id);
				if (index > -1) {
					gearItems.splice(index, 1);
				}
				return gearItems;
			}),
			tap((_) => {
				this.eventBus.emit(new EmitEvent(Events.Loading, false));
				this.snackBarService.openSnackBarFromComponent(`Successfully deleted ${gearItemToDelete.name}`, 'Dismiss', SnackBarEvent.Success);
			}),
			catchError((err) => {
				this.eventBus.emit(new EmitEvent(Events.Loading, false));
				this.snackBarService.openSnackBarFromComponent(`Error occured deleting ${gearItemToDelete.name}`, 'Dismiss', SnackBarEvent.Error);
				return of(null);
			})
		);
	}
}
