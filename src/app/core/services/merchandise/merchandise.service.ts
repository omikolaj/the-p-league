import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GearItem, Size } from '../../models/gear-item..model';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseService {

  constructor() { }

  fetchAllGearItems(): Observable<GearItem[]>{    
    return of([
      { name: 'T-shirt', price: 10, sizes: [Size.ALL], inStock: true, imageUrl: null },
      { name: 'Hoodie', price: 25, sizes: [Size.M, Size.XS, Size.XL, Size.S], inStock: true, imageUrl: null },
      { name: 'Pants', price: 20, sizes: [Size.L, Size.M], inStock: false, imageUrl: null },
      { name: 'Pants', price: 20, sizes: [Size.L, Size.XS, Size.S], inStock: false, imageUrl: null },
      { name: 'Wrist Band', price: 5, sizes: [Size.S, Size.M, Size.L], inStock: true, imageUrl: null },
      { name: 'Long Sleeve', price: 15, sizes: [Size.XL, Size.XS, Size.XXL], inStock: true, imageUrl: null },
      { name: 'Hats', price: 30, sizes: [Size.NONE], inStock: false, imageUrl: null },
      { name: 'Hatss', price: 30, sizes: [Size.L], inStock: false, imageUrl: null }
    ])
  } 
}
