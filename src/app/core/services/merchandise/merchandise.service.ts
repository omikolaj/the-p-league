import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GearItem, Size } from '../../models/gear-item.model';
import { GearSize } from '../../models/gear-size.model';

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
        { size: Size.L, available: true , color: 'warn' }, 
        { size: Size.M, available: false, color: 'warn' }, 
        { size: Size.XS, available: false, color: 'warn' },
        { size: Size.S, available: true , color: 'warn' },
        { size: Size.XL, available: true , color: 'warn' },
      ], inStock: true, imageUrl: null },
      { ID: 2, name: 'Hoodie', price: 25, sizes: [
        { size: Size.L, available: true , color: 'warn' }, 
        { size: Size.S, available: false, color: 'warn' },
        { size: Size.XL, available: true , color: 'warn' },
      ], inStock: true, imageUrl: null },
      { ID: 3, name: 'Pants', price: 20, sizes: [
        { size: Size.L, available: false, color: 'warn' }, 
        { size: Size.M, available: true , color: 'warn' },
      ], inStock: false, imageUrl: null },
      { ID: 4, name: 'Pants', price: 20, sizes: [
        { size: Size.L, available: false, color: 'warn' }, 
        { size: Size.M, available: true , color: 'warn' },
        { size: Size.XL, available: false, color: 'warn' }, 
        { size: Size.S, available: true , color: 'warn' },
      ], inStock: false, imageUrl: null },
      { ID: 5, name: 'Wrist Band', price: 5, sizes: [
        { size: Size.L, available: false, color: 'warn' }, 
        { size: Size.M, available: true , color: 'warn' },
        { size: Size.XL, available: false, color: 'warn' }, 
        { size: Size.S, available: true , color: 'warn'} ,
      ], inStock: true, imageUrl: null },
      { ID: 6, name: 'Long Sleeve', price: 15, sizes: [
        { size: Size.L, available: false, color: 'warn' }
      ], inStock: true, imageUrl: null },
      { ID: 7, name: 'Hats', price: 30, sizes: [
        { size: Size.M, available: false, color: 'warn' }
      ], inStock: false, imageUrl: null },
      { ID: 8, name: 'Hatss', price: 30, sizes: [
        { size: Size.L, available: false, color: 'warn' }, 
        { size: Size.M, available: true , color: 'warn' },
        { size: Size.XL, available: false, color: 'warn' }, 
        { size: Size.S, available: true , color: 'warn' },
      ], inStock: false, imageUrl: null }
    ]);

    return this.gearItems$;

  } 
}
