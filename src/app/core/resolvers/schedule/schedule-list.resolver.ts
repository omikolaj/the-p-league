import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Actions, ofAction, Store } from '@ngxs/store';
import { Observable, race } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import * as Schedule from '../../../shared/store/actions/schedules.actions';
import { ScheduleAsyncService } from './../../services/schedule/schedule-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleListResolver implements Resolve<Schedule.FetchLeaguesSessionSchedulesSuccess | Schedule.FetchLeaguesSesssionSchedulesFailed> {
	constructor(private store: Store, private scheduleAsync: ScheduleAsyncService, private actions$: Actions, private router: Router) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Schedule.FetchLeaguesSessionSchedulesSuccess
		| Schedule.FetchLeaguesSesssionSchedulesFailed
		| Observable<Schedule.FetchLeaguesSessionSchedulesSuccess | Schedule.FetchLeaguesSesssionSchedulesFailed>
		| Promise<Schedule.FetchLeaguesSessionSchedulesSuccess | Schedule.FetchLeaguesSesssionSchedulesFailed> {
		this.store.dispatch(new Schedule.FetchLeaguesSessionSchedules());

		const responseOK: Observable<Schedule.FetchLeaguesSessionSchedulesSuccess> = this.actions$.pipe(
			ofAction(Schedule.FetchLeaguesSessionSchedulesSuccess)
		);

		const responseError = this.actions$.pipe(
			ofAction(Schedule.FetchLeaguesSesssionSchedulesFailed),
			tap(() => this.router.navigate(['']))
		);

		return race(responseOK, responseError).pipe(first());
	}
}
