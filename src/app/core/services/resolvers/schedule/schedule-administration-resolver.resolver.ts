import { tap, first, takeUntil, map, switchMap, debounce, debounceTime } from 'rxjs/operators';
import { combineLatest, race, scheduled, iif, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Store, Actions, ofActionSuccessful, ofActionErrored, Action, ActionType, ofActionDispatched } from '@ngxs/store';
import { ofAction } from '@ngxs/store';
import { Schedule } from '../../../../store/actions/schedule.actions';
import { take } from 'lodash';
import { SportTypeState } from 'src/app/store/state/sport-type.state';
import { ActionContext } from '@ngxs/store/src/actions-stream';
import { log } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationResolver implements Resolve<Schedule.FetchAllSportTypesSuccess | Schedule.FetchAllSportTypesFailed> {
  constructor(private store: Store, private actions$: Actions, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Schedule.FetchAllSportTypesSuccess
    | Schedule.FetchAllSportTypesFailed
    | Observable<Schedule.FetchAllSportTypesSuccess | Schedule.FetchAllSportTypesFailed>
    | Promise<Schedule.FetchAllSportTypesSuccess | Schedule.FetchAllSportTypesFailed> {
    this.store.dispatch(new Schedule.FetchAllSportTypes());

    const responseOK: Observable<Schedule.FetchAllSportTypesSuccess> = this.actions$.pipe(ofAction(Schedule.FetchAllSportTypesSuccess));

    const responseError = this.actions$.pipe(
      ofAction(Schedule.FetchAllSportTypesFailed),
      tap(() => this.router.navigate(['']))
    );

    return race(responseOK, responseError).pipe(first());
  }
}
