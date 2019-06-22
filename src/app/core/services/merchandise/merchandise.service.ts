import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, of } from "rxjs";
import { GearItem } from "../../models/gear-item.model";
import {
  flatMap,
  map,
  tap,
  shareReplay,
  switchMap,
  catchError
} from "rxjs/operators";
import { combineLatest } from "rxjs";
import { Size } from "../../models/gear-size.model";
import { HttpClient } from "@angular/common/http";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import {
  SnackBarService,
  SnackBarEvent
} from "src/app/shared/components/snack-bar/snack-bar-service.service";

@Injectable({
  providedIn: "root"
})
export class MerchandiseService implements Resolve<Observable<GearItem[]>> {
  private readonly merchandiseUrl: string = "merchandise";
  updateGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<
    GearItem
  >(null);
  addGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<GearItem>(
    null
  );
  deleteGearItemAction: BehaviorSubject<GearItem> = new BehaviorSubject<
    GearItem
  >(null);
  pageChangeAction: BehaviorSubject<{}> = new BehaviorSubject<{}>(null);
  gearItems$: Observable<GearItem[]> = new BehaviorSubject<GearItem[]>(
    []
  ).asObservable();
  gearItems: GearItem[];

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this.gearItems$ = this.http.get<GearItem[]>(this.merchandiseUrl).pipe(
      map((gearItems: GearItem[]) => (this.gearItems = gearItems).reverse()),
      catchError(() => {
        this.snackBarService.openSnackBarFromComponent(
          `Error occured while getting store items. Please come back later`,
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
      flatMap((gearItems: GearItem[]) =>
        gearItems.filter((gearItem: GearItem) => gearItem.id === id)
      )
    );
  }

  updatedGearItems$ = combineLatest([
    this.updateGearItemAction,
    this.gearItems$
  ]).pipe(
    switchMap(([updatedGearItem]) => {
      return this.updateGearItemAsync(updatedGearItem);
    })
  );

  updateGearItem(gearItem: GearItem) {
    this.updateGearItemAction.next(gearItem);
  }

  updateGearItemAsync(gearItem: GearItem): Observable<GearItem[]> {
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
        this.snackBarService.openSnackBarFromComponent(
          `Successfully updated ${gearItem.name} gear item`,
          "Dismiss",
          SnackBarEvent.Success
        );
      }),
      catchError(() => {
        this.snackBarService.openSnackBarFromComponent(
          `Error occured while updating ${gearItem.name} gear item`,
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
      return this.createGearItemAsync(newGearItem);
    })
  );

  createGearItem(gearItem: GearItem) {
    this.addGearItemAction.next(gearItem);
  }

  createGearItemAsync(gearItem: GearItem): Observable<GearItem[]> {
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
        this.snackBarService.openSnackBarFromComponent(
          `Successfully created ${gearItem.name} gear item`,
          "Dismiss",
          SnackBarEvent.Success
        );
      }),
      catchError(() => {
        this.snackBarService.openSnackBarFromComponent(
          `Error occured while creating ${gearItem.name} gear item`,
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
      return this.deleteGearItemAsync(gearItemToDelete);
    })
  );

  deleteGearItem(gearItem: GearItem) {
    this.deleteGearItemAction.next(gearItem);
  }

  deleteGearItemAsync(gearItemToDelete: GearItem) {
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
        this.snackBarService.openSnackBarFromComponent(
          `Successfully deleted ${gearItemToDelete.name} gear item`,
          "Dismiss",
          SnackBarEvent.Success
        );
      }),
      catchError(err => {
        this.snackBarService.openSnackBarFromComponent(
          `Error occured while deleting ${gearItemToDelete.name} gear item`,
          "Dismiss",
          SnackBarEvent.Error
        );
        return of([]);
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
