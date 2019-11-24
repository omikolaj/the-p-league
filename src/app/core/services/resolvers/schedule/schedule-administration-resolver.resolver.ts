import { tap, first } from 'rxjs/operators';
import { race } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store, Actions } from '@ngxs/store';
import { ofAction } from '@ngxs/store';
import { Sports } from '../../../../store/actions/sports.actions';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationResolver implements Resolve<Sports.FetchAllSportTypesSuccess | Sports.FetchAllSportTypesFailed> {
  constructor(private store: Store, private actions$: Actions, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Sports.FetchAllSportTypesSuccess
    | Sports.FetchAllSportTypesFailed
    | Observable<Sports.FetchAllSportTypesSuccess | Sports.FetchAllSportTypesFailed>
    | Promise<Sports.FetchAllSportTypesSuccess | Sports.FetchAllSportTypesFailed> {
    this.store.dispatch(new Sports.FetchAllSportTypes());

    const responseOK: Observable<Sports.FetchAllSportTypesSuccess> = this.actions$.pipe(ofAction(Sports.FetchAllSportTypesSuccess));

    const responseError = this.actions$.pipe(
      ofAction(Sports.FetchAllSportTypesFailed),
      tap(() => this.router.navigate(['']))
    );

    return race(responseOK, responseError).pipe(first());
  }
}
