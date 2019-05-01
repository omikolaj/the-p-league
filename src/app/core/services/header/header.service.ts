import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  isSticky$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() { }

  setStickyHeaderPosition(positionSticky: boolean){
    this.isSticky$.next(positionSticky);
  }
  
}
