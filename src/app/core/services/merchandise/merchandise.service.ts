import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { GearItem } from "../../models/gear-item.model";
import { flatMap, map } from "rxjs/operators";
import { Size } from "../../models/gear-size.model";

@Injectable({
  providedIn: "root"
})
export class MerchandiseService {
  // make the http call here
  // this.http.get<Product[]>('api/v1/make-call-here').pipe(etc)
  gearItemsSubject$ = new BehaviorSubject<GearItem[]>(storeItems);
  gearItems$: Observable<GearItem[]>;

  constructor() {
    this.gearItems$ = of(storeItems);
  }

  fetchAllGearItems(): Observable<GearItem[]> {
    return this.gearItems$;
  }

  findGearItem(ID: number): Observable<GearItem> {
    return this.gearItems$.pipe(
      flatMap((gearItems: GearItem[]) =>
        gearItems.filter((gearItem: GearItem) => gearItem.ID === ID)
      )
    );
  }

  updateGearItem(gearItem: GearItem): Observable<boolean> {
    return this.gearItems$.pipe(
      map((gearItems: GearItem[]) => {
        const index: number = gearItems
          .map((gearItem: GearItem) => gearItem.ID)
          .indexOf(gearItem.ID);
        const validIndex: boolean = index > -1;
        if (validIndex) {
          gearItems.splice(index, 1, gearItem);
        }
        this.gearItemsSubject$.next(gearItems);
        return validIndex;
      })
    );
  }

  createGearItem(gearItem: GearItem): Observable<GearItem> {
    gearItem.ID = Math.floor(Math.random() * 1000) + 1;
    return this.gearItems$.pipe(
      map((gearItems: GearItem[]) => {
        gearItems.unshift(gearItem);
        this.gearItemsSubject$.next(gearItems);
        return gearItem;
      })
    );
  }

  deleteGearItem(ID: number): Observable<boolean> {
    // remove gear item
    return this.gearItems$.pipe(
      map((gearItems: GearItem[]) => {
        const index: number = gearItems
          .map((gearItem: GearItem) => gearItem.ID)
          .indexOf(ID);
        const validIndex: boolean = index > -1;
        if (validIndex) {
          gearItems.splice(index, 1);
        }
        this.gearItemsSubject$.next(gearItems);
        return validIndex;
      })
    );
  }
}

export const storeItems: GearItem[] = [
  {
    ID: 1,
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
        ID: "1",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/IMG_5585.JPG"
      },
      {
        ID: "123",
        name: "image2",
        size: 12,
        type: "type",
        url: "../../../assets/IMG_5904.JPG"
      }
    ]
  },
  {
    ID: 2,
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
        ID: "11",
        name: "image41",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      },
      {
        ID: "1",
        name: "image44",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      },
      {
        ID: "3",
        name: "image43",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 3,
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
        ID: "31",
        name: "imageerw1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 4,
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
        ID: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 5,
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
        ID: "3",
        name: "imagesa1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 6,
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
        ID: "1w3",
        name: "imwage1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 7,
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
        ID: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 8,
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
        ID: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 9,
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
        ID: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 10,
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
        ID: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  },
  {
    ID: 11,
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
        ID: "13",
        name: "image1",
        size: 12,
        type: "type",
        url: "../../../assets/default_gear.png"
      }
    ]
  }
];
