import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, of, Subject } from "rxjs";
import { GearItem } from "../../models/merchandise/gear-item.model";
import {
  flatMap,
  map,
  tap,
  shareReplay,
  switchMap,
  catchError
} from "rxjs/operators";
import { combineLatest } from "rxjs";
import { Size } from "../../models/merchandise/gear-size.model";
import { HttpClient } from "@angular/common/http";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import {
  SnackBarService,
  SnackBarEvent
} from "src/app/shared/components/snack-bar/snack-bar-service.service";
import { PreOrderForm } from "../../models/merchandise/pre-order-form.model";
import {
  EventBusService,
  EmitEvent,
  Events
} from "../event-bus/event-bus.service";
import { handleError } from "src/app/helpers/handleError";

@Injectable({
  providedIn: "root"
})
export class MerchandiseService implements Resolve<Observable<GearItem[]>> {
  public readonly merchandiseUrl: string = "merchandise";
  private updateGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<
    GearItem
  >(null);
  private addGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<
    GearItem
  >(null);
  private deleteGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<
    GearItem
  >(null);
  pageChangeAction: BehaviorSubject<{}> = new BehaviorSubject<{}>(null);

  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();

  // We need a separate loading for delete because otherwise if we trigger update loading or new
  // both the card individual loading bar will appear and the one in the dialog
  private loadingDeleteSubject = new Subject<boolean>();
  loadingDelete$ = this.loadingDeleteSubject.asObservable();

  gearItems$: Observable<GearItem[]> = new BehaviorSubject<GearItem[]>(
    []
  ).asObservable();
  gearItems: GearItem[];

  constructor(
    public http: HttpClient,
    public snackBarService: SnackBarService,
    private eventBus: EventBusService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this.gearItems$ = this.http.get<GearItem[]>(this.merchandiseUrl).pipe(
      map((gearItems: GearItem[]) => (this.gearItems = gearItems).reverse()),
      catchError(() => {
        this.router.navigate(["about"]);
        this.snackBarService.openSnackBarFromComponent(
          `Error occured. Please come back later`,
          "Dismiss",
          SnackBarEvent.Error
        );
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
        const item = gearItems.filter(
          (gearItem: GearItem) => gearItem.id === id
        );
        return item;
      })
    );
  }

  updatedGearItems$ = combineLatest([
    this.updateGearItemAction,
    this.gearItems$
  ]).pipe(
    switchMap(([updatedGearItem]) => {
      this.loadingSubject.next(true);
      return this.updateGearItemAsync(updatedGearItem);
    })
  );

  updateGearItem(gearItem: GearItem) {
    this.updateGearItemAction.next(gearItem);
  }

  private updateGearItemAsync(gearItem: GearItem): Observable<GearItem[]> {
    if (gearItem === null) {
      return of([]);
    }
    return combineLatest([
      this.gearItems$,
      this.http.patch<GearItem>(
        `${this.merchandiseUrl}/${gearItem.id}`,
        gearItem.formData
      )
    ]).pipe(
      map(([gearItems, updatedGearItem]: [GearItem[], GearItem]) => {
        const index: number = gearItems
          .map((gearItem: GearItem) => gearItem.id)
          .indexOf(gearItem.id);
        if (index > -1) {
          gearItems.splice(index, 1, updatedGearItem);
        }
        return gearItems;
      }),
      tap(_ => {
        this.loadingSubject.next(false);
        this.snackBarService.openSnackBarFromComponent(
          `Successfully updated ${gearItem.name}`,
          "Dismiss",
          SnackBarEvent.Success
        );
      }),
      tap(() => this.eventBus.emit(new EmitEvent(Events.CloseOpen, true))),
      catchError(() => {
        this.loadingSubject.next(false);
        this.snackBarService.openSnackBarFromComponent(
          `Error occured updating ${gearItem.name}`,
          "Dismiss",
          SnackBarEvent.Error
        );
        return of([]);
      })
    );
  }

  newLatestGearItems$ = combineLatest([
    this.addGearItemAction,
    this.gearItems$
  ]).pipe(
    switchMap(([newGearItem]) => {
      this.loadingSubject.next(true);
      return this.createGearItemAsync(newGearItem);
    })
  );

  createGearItem(gearItem: GearItem) {
    this.addGearItemAction.next(gearItem);
  }

  private createGearItemAsync(gearItem: GearItem): Observable<GearItem[]> {
    if (gearItem === null) {
      return of([]);
    }
    return combineLatest([
      this.gearItems$,
      this.http.post<GearItem>(`${this.merchandiseUrl}`, gearItem.formData)
    ]).pipe(
      map(([gearItems, newGearItem]: [GearItem[], GearItem]) => {
        gearItems.unshift(newGearItem);
        return gearItems;
      }),
      tap(_ => {
        this.loadingSubject.next(false);
        this.snackBarService.openSnackBarFromComponent(
          `Successfully created ${gearItem.name}`,
          "Dismiss",
          SnackBarEvent.Success
        );
      }),
      tap(() => this.eventBus.emit(new EmitEvent(Events.CloseOpen, true))),
      catchError(() => {
        this.loadingSubject.next(false);
        this.snackBarService.openSnackBarFromComponent(
          `Error occured creating ${gearItem.name}`,
          "Dismiss",
          SnackBarEvent.Error
        );
        return of([]);
      })
    );
  }

  deleteGearItemsLatest$ = combineLatest([
    this.deleteGearItemAction,
    this.gearItems$
  ]).pipe(
    switchMap(([gearItemToDelete]) => {
      this.loadingDeleteSubject.next(true);
      return this.deleteGearItemAsync(gearItemToDelete);
    })
  );

  deleteGearItem(gearItem: GearItem) {
    this.deleteGearItemAction.next(gearItem);
  }

  private deleteGearItemAsync(gearItemToDelete: GearItem) {
    if (gearItemToDelete === null) {
      return of([]);
    }
    return combineLatest([
      this.gearItems$,
      this.http.delete<void>(`${this.merchandiseUrl}/${gearItemToDelete.id}`)
    ]).pipe(
      map(([gearItems]: [GearItem[], void]) => {
        const index: number = gearItems
          .map((gearItem: GearItem) => gearItem.id)
          .indexOf(gearItemToDelete.id);
        if (index > -1) {
          gearItems.splice(index, 1);
        }
        return gearItems;
      }),
      tap(_ => {
        this.loadingDeleteSubject.next(false);
        this.snackBarService.openSnackBarFromComponent(
          `Successfully deleted ${gearItemToDelete.name}`,
          "Dismiss",
          SnackBarEvent.Success
        );
      }),
      catchError(err => {
        this.loadingDeleteSubject.next(false);
        this.snackBarService.openSnackBarFromComponent(
          `Error occured deleting ${gearItemToDelete.name}`,
          "Dismiss",
          SnackBarEvent.Error
        );
        return of(null);
      })
    );
  }
}

export const storeItems: GearItem[] = [
  {
    id: 1,
    name: "T-shirt",
    price: 10,
    sizes: [
      { size: Size.L, available: false, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: false, color: "warn" },
      { size: Size.XL, available: true, color: "warn" },
      { size: Size.XXL, available: true, color: "warn" }
    ],
    inStock: true,
    images: [
      {
        id: "1",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/IMG_5585.JPG",
        small: "../../../assets/IMG_5585.JPG",
        medium: "../../../assets/IMG_5585.JPG",
        big: "../../../assets/IMG_5585.JPG"
      },
      {
        id: "123",
        name: "image2",
        size: 12,
        type: "type",
        url: "../../../assets/IMG_5904.JPG",
        small: "../../../assets/IMG_5904.JPG",
        medium: "../../../assets/IMG_5904.JPG",
        big: "../../../assets/IMG_5904.JPG"
      }
    ]
  },
  {
    id: 2,
    name: "Hoodie",
    price: 25,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: true, color: "warn" },
      { size: Size.XL, available: false, color: "warn" },
      { size: Size.XXL, available: true, color: "warn" }
    ],
    inStock: true,
    images: [
      {
        id: "11",
        name: "image41",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      },
      {
        id: "1",
        name: "image44",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      },
      {
        id: "3",
        name: "image43",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 3,
    name: "Pants",
    price: 20,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: false, color: "warn" },
      { size: Size.XL, available: false, color: "warn" },
      { size: Size.XXL, available: false, color: "warn" }
    ],
    inStock: false,
    images: [
      {
        id: "31",
        name: "imageerw1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 4,
    name: "Pants",
    price: 20,
    sizes: [
      { size: Size.L, available: false, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: false, color: "warn" },
      { size: Size.XL, available: false, color: "warn" },
      { size: Size.XXL, available: false, color: "warn" }
    ],
    inStock: false,
    images: [
      {
        id: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 5,
    name: "Wrist Band",
    price: 5,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: true, color: "warn" },
      { size: Size.XS, available: true, color: "warn" },
      { size: Size.S, available: true, color: "warn" },
      { size: Size.XL, available: true, color: "warn" },
      { size: Size.XXL, available: true, color: "warn" }
    ],
    inStock: true,
    images: [
      {
        id: "3",
        name: "imagesa1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 6,
    name: "Long Sleeve",
    price: 15,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: true, color: "warn" },
      { size: Size.XL, available: true, color: "warn" },
      { size: Size.XXL, available: true, color: "warn" }
    ],
    inStock: true,
    images: [
      {
        id: "1w3",
        name: "imwage1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 7,
    name: "Hats",
    price: 30,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: true, color: "warn" },
      { size: Size.XL, available: true, color: "warn" },
      { size: Size.XXL, available: true, color: "warn" }
    ],
    inStock: false,
    images: [
      {
        id: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 8,
    name: "Hatss",
    price: 30,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: false, color: "warn" },
      { size: Size.XL, available: false, color: "warn" },
      { size: Size.XXL, available: false, color: "warn" }
    ],
    inStock: false,
    images: [
      {
        id: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 9,
    name: "Watch",
    price: 30,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: false, color: "warn" },
      { size: Size.XL, available: false, color: "warn" },
      { size: Size.XXL, available: false, color: "warn" }
    ],
    inStock: false,
    images: [
      {
        id: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 10,
    name: "Jorts",
    price: 30,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: false, color: "warn" },
      { size: Size.XL, available: false, color: "warn" },
      { size: Size.XXL, available: false, color: "warn" }
    ],
    inStock: false,
    images: [
      {
        id: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    id: 11,
    name: "Jortss",
    price: 30,
    sizes: [
      { size: Size.L, available: true, color: "warn" },
      { size: Size.M, available: false, color: "warn" },
      { size: Size.XS, available: false, color: "warn" },
      { size: Size.S, available: false, color: "warn" },
      { size: Size.XL, available: false, color: "warn" },
      { size: Size.XXL, available: false, color: "warn" }
    ],
    inStock: false,
    images: [
      {
        id: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png",
        small: "../../../assets/default_gear.png",
        medium: "../../../assets/default_gear.png",
        big: "../../../assets/default_gear.png"
      }
    ]
  }
];
