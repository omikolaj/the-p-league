import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, AsyncSubject, ReplaySubject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  isSticky$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hideToolbarHeader$: ReplaySubject<boolean> = new ReplaySubject(1);   

  constructor() { }

  setStickyHeaderPosition(positionSticky: boolean){
    this.isSticky$.next(positionSticky);
  }

  hideToolbar(hideToolbar: boolean): void{   
    this.hideToolbarHeader$.next(hideToolbar)
    console.log('[Inside HeaderService]');;
  }
  
}
