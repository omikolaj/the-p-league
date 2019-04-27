import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GearItem } from '../../models/gear-item.model';
import { flatMap,  } from 'rxjs/operators';
import { Size } from '../../models/gear-size.model';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseService {
  private _gearItems$: Observable<GearItem[]>;

  get gearItems$(): Observable<GearItem[]>{    
    return this._gearItems$;
  }

  set gearItems$(gearItems$: Observable<GearItem[]>){
    this._gearItems$ = gearItems$;    
  }

  constructor() { }

  fetchAllGearItems(): Observable<GearItem[]>{    
    this.gearItems$ = of([
      { ID: 1, name: 'T-shirt', price: 10, sizes: [
        { size: Size.L, available: false , color: 'warn' }, 
        { size: Size.M, available: false, color: 'warn' }, 
        { size: Size.XS, available: false, color: 'warn' },
        { size: Size.S, available: false , color: 'warn' },
        { size: Size.XL, available: true , color: 'warn' },
        { size: Size.XXL, available: true , color: 'warn' },
      ], inStock: true, images: [
        { ID: "1", name: "image1", size: 12, type: "type", URL: "../../../assets/default_gear.png" },
        { ID: "123", name: "image2", size: 12, type: "type", URL: "../../../assets/default_gear.png" }
      ]},
      { ID: 2, name: 'Hoodie', price: 25, sizes: [
        { size: Size.L, available: true , color: 'warn' }, 
        { size: Size.M, available: false, color: 'warn' }, 
        { size: Size.XS, available: false, color: 'warn' },
        { size: Size.S, available: true , color: 'warn' },
        { size: Size.XL, available: false , color: 'warn' },
        { size: Size.XXL, available: true , color: 'warn' },
      ], inStock: true, images: [
        { ID: "11", name: "image41", size: 12, type: "type", URL: "../../../assets/default_gear.png" },
        { ID: "1", name: "image44", size: 12, type: "type", URL: "../../../assets/default_gear.png" },
        { ID: "3", name: "image43", size: 12, type: "type", URL: "../../../assets/default_gear.png" }
      ]},
      { ID: 3, name: 'Pants', price: 20, sizes: [
        { size: Size.L, available: true , color: 'warn' }, 
        { size: Size.M, available: false, color: 'warn' }, 
        { size: Size.XS, available: false, color: 'warn' },
        { size: Size.S, available: false , color: 'warn' },
        { size: Size.XL, available: false , color: 'warn' },
        { size: Size.XXL, available: false , color: 'warn' },
      ], inStock: false, image: [
        { ID: "31", name: "imageerw1", size: 12, type: "type", URL: "../../../assets/default_gear.png" }
      ]},
      { ID: 4, name: 'Pants', price: 20, sizes: [
        { size: Size.L, available: false , color: 'warn' }, 
        { size: Size.M, available: false, color: 'warn' }, 
        { size: Size.XS, available: false, color: 'warn' },
        { size: Size.S, available: false , color: 'warn' },
        { size: Size.XL, available: false , color: 'warn' },
        { size: Size.XXL, available: false , color: 'warn' },
      ], inStock: false, images: [
        { ID: "13", name: "image1", size: 12, type: "type", URL: "../../../assets/default_gear.png" }
      ]},
      { ID: 5, name: 'Wrist Band', price: 5, sizes: [
        { size: Size.L, available: true , color: 'warn' }, 
        { size: Size.M, available: true, color: 'warn' }, 
        { size: Size.XS, available: true, color: 'warn' },
        { size: Size.S, available: true , color: 'warn' },
        { size: Size.XL, available: true , color: 'warn' },
        { size: Size.XXL, available: true , color: 'warn' },
      ], inStock: true, images: [
        { ID: "3", name: "imagesa1", size: 12, type: "type", URL: "../../../assets/default_gear.png" }
      ]},
      { ID: 6, name: 'Long Sleeve', price: 15, sizes: [
        { size: Size.L, available: true , color: 'warn' }, 
        { size: Size.M, available: false, color: 'warn' }, 
        { size: Size.XS, available: false, color: 'warn' },
        { size: Size.S, available: true , color: 'warn' },
        { size: Size.XL, available: true , color: 'warn' },
        { size: Size.XXL, available: true , color: 'warn' },
      ], inStock: true, images: [
        { ID: "1w3", name: "imwage1", size: 12, type: "type", URL: "../../../assets/default_gear.png" }
      ]},
      { ID: 7, name: 'Hats', price: 30, sizes: [
        { size: Size.L, available: true , color: 'warn' }, 
        { size: Size.M, available: false, color: 'warn' }, 
        { size: Size.XS, available: false, color: 'warn' },
        { size: Size.S, available: true , color: 'warn' },
        { size: Size.XL, available: true , color: 'warn' },
        { size: Size.XXL, available: true , color: 'warn' },
      ], inStock: false, images: [
        { ID: "13", name: "image1", size: 12, type: "type", URL: "../../../assets/default_gear.png" }
      ] },
      { ID: 8, name: 'Hatss', price: 30, sizes: [
        { size: Size.L, available: true , color: 'warn' }, 
        { size: Size.M, available: false, color: 'warn' }, 
        { size: Size.XS, available: false, color: 'warn' },
        { size: Size.S, available: false , color: 'warn' },
        { size: Size.XL, available: false , color: 'warn' },
        { size: Size.XXL, available: false , color: 'warn' },
      ], inStock: false, images: [
        { ID: "13", name: "image1", size: 12, type: "type", URL: "../../../assets/default_gear.png" }
      ] }
    ]);

    return this.gearItems$;

  } 

  findGearItem(ID: number): Observable<GearItem>{
    return this.gearItems$.pipe(
      flatMap((gearItems: GearItem[]) => gearItems.filter((gearItem: GearItem) => gearItem.ID === ID))      
    )    
  }

  createGearItem(newGearItem: FormData): Observable<any>{
    // create HTTP request to the backend to create a new item
    return of({})
  }

  deleteGearItem(ID: number): Observable<GearItem>{
    // remove gear item
    return this.gearItems$.pipe(
      flatMap((gearItems: GearItem[]) => gearItems.filter((gearItem: GearItem) => gearItem.ID !== gearItem.ID))
    )
  }
}
