import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Actions, ofAction, Store } from '@ngxs/store';
import { Observable, race } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import * as Sports from '../../../shared/store/actions/sports.actions';

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

		return race(responseOK, responseError).pipe(
			tap(() => console.log('inside admin resolver')),
			first()
		);
	}
}
