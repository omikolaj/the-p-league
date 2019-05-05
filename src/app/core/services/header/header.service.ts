import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  isSticky$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hideToolbarHeader$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  sidenavText: string[] = [   
    'Merchandise',
    'Gallery'
  ]

  constructor() { }

  setStickyHeaderPosition(positionSticky: boolean){
    this.isSticky$.next(positionSticky);
  }

  hideToolbar(hideToolbar: boolean): void{       
    this.hideToolbarHeader$.next(hideToolbar)
  }
  
}
