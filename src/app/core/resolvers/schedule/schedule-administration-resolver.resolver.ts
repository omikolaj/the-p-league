import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { normalize } from 'normalizr';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { sportListSchema } from 'src/app/shared/store/schema/schema';
import * as Leagues from '../../../shared/store/actions/leagues.actions';
import * as Sports from '../../../shared/store/actions/sports.actions';
import * as Teams from '../../../shared/store/actions/teams.actions';
import { SportType } from '../../models/schedule/sport-type.model';
import { ScheduleAdministrationAsyncService } from '../../services/schedule/schedule-administration/schedule-administration-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationResolver implements Resolve<SportType[]> {
	constructor(private store: Store, private router: Router, private scheduleAdminAsync: ScheduleAdministrationAsyncService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): SportType[] | Observable<SportType[]> | Promise<SportType[]> {
		return this.scheduleAdminAsync.fetchAllSportTypes().pipe(
			tap((sports) => {
				console.log('raw sportsData', sports);
				const normalizedData = normalize(sports, sportListSchema);
				console.log('normalized sportsData', normalizedData);
				this.store.dispatch([
					new Sports.InitializeSports(normalizedData.entities['sports']),
					new Leagues.InitializeLeagues(normalizedData.entities['leagues']),
					new Teams.InitializeTeams(normalizedData.entities['teams'])
				]);
			}),
			catchError((err) => {
				// TODO handle displaying of the error
				this.router.navigate(['']);
				return of([]);
			})
		);
	}
}
