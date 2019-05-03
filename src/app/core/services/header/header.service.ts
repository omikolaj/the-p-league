import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, AsyncSubject, ReplaySubject } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  isSticky$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hideToolbarHeader$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  ngOnInit(){
  }

  setStickyHeaderPosition(positionSticky: boolean){
    this.isSticky$.next(positionSticky);
  }

  hideToolbar(hideToolbar: boolean): void{   
    this.hideToolbarHeader$.next(hideToolbar)
  }
  
}
