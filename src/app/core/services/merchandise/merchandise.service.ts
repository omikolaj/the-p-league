import { Injectable } from "@angular/core";
import {
  Observable,
  of,
  BehaviorSubject,
  Subject,
  throwError,
  merge,
  EMPTY,
  race,
  AsyncSubject,
  ReplaySubject,
  forkJoin
} from "rxjs";
import { GearItem } from "../../models/gear-item.model";
import {
  flatMap,
  map,
  tap,
  catchError,
  mergeMap,
  shareReplay,
  share,
  first,
  startWith,
  switchMap
} from "rxjs/operators";
import { combineLatest } from "rxjs";
import { Size } from "../../models/gear-size.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class MerchandiseService implements Resolve<Observable<GearItem[]>> {
  headers = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };
  private readonly merchandiseUrl: string = "merchandise";

  gearItemsSubject$ = new BehaviorSubject<GearItem[]>([]);
  gearItems$: Observable<GearItem[]> = this.gearItemsSubject$.asObservable();
  gearItems: GearItem[];

  constructor(private http: HttpClient) {
    //this.gearItems$ = of(storeItems);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return (this.gearItems$ = this.http
      .get<GearItem[]>(this.merchandiseUrl)
      .pipe(
        tap(gearItems => this.gearItemsSubject$.next(gearItems)),
        map((gearItems: GearItem[]) => (this.gearItems = gearItems)),
        shareReplay()
      ));
  }

  fetchAllGearItems(): Observable<GearItem[]> {
    return this.gearItems$;
  }

  findGearItem(ID: number): Observable<GearItem> {
    return this.gearItems$.pipe(
      flatMap((gearItems: GearItem[]) =>
        gearItems.filter((gearItem: GearItem) => gearItem.id === ID)
      )
    );
  }

  updateGearItem(gearItem: GearItem): Observable<any> {
    const headers = {
      headers: new HttpHeaders({
        // "X-Requested-With": "XMLHttpRequest"
        "Content-Type": "multipart/form-data"
      })
    };
    return this.http
      .patch<GearItem>(
        `${this.merchandiseUrl}/${gearItem.id}`,
        gearItem.formData
      )
      .pipe(
        flatMap(gearItem => this.gearItems$),
        map(gearItems => {
          const index: number = gearItems
            .map((gearItem: GearItem) => gearItem.id)
            .indexOf(gearItem.id);
          const validIndex: boolean = index > -1;
          if (validIndex) {
            gearItems.splice(index, 1, gearItem);
          }
          return gearItems;
        }),
        tap(updatedGearItems => this.gearItemsSubject$.next(updatedGearItems)),
        catchError(err => {
          console.log(err);
          return err;
        })
      );
  }

  createGearItem(gearItem: GearItem): Observable<GearItem[]> {
    return combineLatest([
      this.gearItems$,
      this.http.post<GearItem>(`${this.merchandiseUrl}`, gearItem.formData)
    ]).pipe(
      map(([gearItems, newGearItem]: [GearItem[], GearItem]) => {
        gearItems.unshift(newGearItem);
        return gearItems;
      }),
      tap(updatedGearItems => this.gearItemsSubject$.next(updatedGearItems))
    );
  }

  deleteGearItem(Id: number): Observable<GearItem[]> {
    return this.http
      .delete<void>(`${this.merchandiseUrl}/${Id}`, this.headers)
      .pipe(
        flatMap(_ => this.gearItems$),
        map(gearItems => {
          const index: number = gearItems
            .map((gearItem: GearItem) => gearItem.id)
            .indexOf(Id);
          const validIndex: boolean = index > -1;
          if (validIndex) {
            gearItems.splice(index, 1);
          }
          return gearItems;
        }),
        tap((gearItems: GearItem[]) => {
          this.gearItemsSubject$.next(gearItems);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (typeof err === "string") {
      errorMessage = err;
    } else {
      if (err.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
      }
    }
    console.error(err);
    return throwError(errorMessage);
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
