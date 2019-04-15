import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GearItem, Size } from '../../models/gear-item..model';

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
      { ID: 1, name: 'T-shirt', price: 10, sizes: [Size.ALL], inStock: true, imageUrl: null },
      { ID: 2, name: 'Hoodie', price: 25, sizes: [Size.M, Size.XS, Size.XL, Size.S], inStock: true, imageUrl: null },
      { ID: 3, name: 'Pants', price: 20, sizes: [Size.L, Size.M], inStock: false, imageUrl: null },
      { ID: 4, name: 'Pants', price: 20, sizes: [Size.L, Size.XS, Size.S], inStock: false, imageUrl: null },
      { ID: 5, name: 'Wrist Band', price: 5, sizes: [Size.S, Size.M, Size.L], inStock: true, imageUrl: null },
      { ID: 6, name: 'Long Sleeve', price: 15, sizes: [Size.XL, Size.XS, Size.XXL], inStock: true, imageUrl: null },
      { ID: 7, name: 'Hats', price: 30, sizes: [Size.NONE], inStock: false, imageUrl: null },
      { ID: 8, name: 'Hatss', price: 30, sizes: [Size.L], inStock: false, imageUrl: null }
    ]);

    return this.gearItems$;

  } 
}
