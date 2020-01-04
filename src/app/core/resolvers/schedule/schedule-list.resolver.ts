import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { forkJoin, Observable, race } from 'rxjs';
import { first, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { ScheduleState } from 'src/app/shared/store/state/schedule.state';
import * as Leagues from '../../../shared/store/actions/leagues.actions';
import * as Schedules from '../../../shared/store/actions/schedules.actions';
import * as Sports from '../../../shared/store/actions/sports.actions';
import * as Teams from '../../../shared/store/actions/teams.actions';
import LeagueSessionSchedule from '../../models/schedule/league-session-schedule.model';
import { League, LeagueDTO } from '../../models/schedule/league.model';
import { SportType, SportTypeDTO } from '../../models/schedule/sport-type.model';
import { TeamDTO } from '../../models/schedule/team.model';
import { ScheduleAsyncService } from './../../services/schedule/schedule-async.service';

// @Injectable({
// 	providedIn: 'root'
// })
// export class ScheduleListResolver implements Resolve<LeagueSessionSchedule[]> {
// 	constructor(private store: Store, private scheduleAsync: ScheduleAsyncService, private actions$: Actions, private router: Router) {}

// 	resolve(
// 		route: ActivatedRouteSnapshot,
// 		state: RouterStateSnapshot
// 	): LeagueSessionSchedule[] | Observable<LeagueSessionSchedule[]> | Promise<LeagueSessionSchedule[]> {
// 		return this.scheduleAsync.fetchLeaguesSessionSchedules().pipe(
// 			tap((sessions) => this.store.dispatch(new Schedule.InitializeLeagueSessionSchedules(sessions))),
// 			tap(() => this.store.dispatch(new Sport.FetchAllSportTypes()))
// 		);
// 	}
// }

@Injectable({
	providedIn: 'root'
})
export class ScheduleListResolver implements Resolve<Schedules.FetchLeaguesSessionSchedulesSuccess | Schedules.FetchLeaguesSesssionSchedulesFailed> {
	@Select(ScheduleState.getActiveSessions) private sessions$: Observable<LeagueSessionSchedule[]>;

	constructor(private store: Store, private scheduleAsync: ScheduleAsyncService, private actions$: Actions, private router: Router) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Schedules.FetchLeaguesSessionSchedulesSuccess
		| Schedules.FetchLeaguesSesssionSchedulesFailed
		| Observable<Schedules.FetchLeaguesSessionSchedulesSuccess | Schedules.FetchLeaguesSesssionSchedulesFailed>
		| Promise<Schedules.FetchLeaguesSessionSchedulesSuccess | Schedules.FetchLeaguesSesssionSchedulesFailed> {
		this.store.dispatch(new Schedules.FetchLeaguesSessionSchedules());

		const responseOK: Observable<Schedules.FetchLeaguesSessionSchedulesSuccess> = this.actions$.pipe(
			ofAction(Schedules.FetchLeaguesSessionSchedulesSuccess)
		);

		const responseError = this.actions$.pipe(
			ofAction(Schedules.FetchLeaguesSesssionSchedulesFailed),
			tap(() => this.router.navigate(['']))
		);

		return race(responseOK, responseError).pipe(
			// grab the first value from either responeOK or error
			first(),
			// grab the latest value from the schedules store.
			// this should be set by the first line in this resolver (this.store.dispatch(new Schedule.FetchleagueSessionSchedules()))
			withLatestFrom(this.sessions$),
			// map the sessions array and wrap it in an observable
			map(([any, sessions]) => sessions),
			// merge all requests into one
			mergeMap((sessions) =>
				// wait for all async requests to complete before returning
				forkJoin(
					sessions.map((session) =>
						this.scheduleAsync.fetchLeagueByID(session.leagueID).pipe(
							tap((league) => {
								const incomingLeague: League = this.mapLeagueDTOToLeague(league);
								const leagueTeamIDs = this.mapLeagueTeamIDs(league.id, league.teams);
								const incomingSport: SportType = this.mapSportTypeDTOToSportType(league.sportType);
								const sportTypeLeagueIDs = this.mapSportTypeLeagueIDs(league.sportTypeID, league.id);
								const actions = [
									new Leagues.AddLeague(incomingLeague),
									new Leagues.AddTeamIDsToLeague(leagueTeamIDs),
									new Sports.AddSportType(incomingSport),
									new Sports.AddLeagueIDsToSportType(sportTypeLeagueIDs),
									new Teams.AddTeams(league.teams)
								];
								this.store.dispatch(actions);
							})
						)
					)
				)
			)
		);
	}

	private mapSportTypeLeagueIDs(sportTypeID: string, leagueID: string): { sportTypeID: string; ids: string[] }[] {
		return [{ sportTypeID: sportTypeID, ids: [leagueID] }];
	}

	private mapLeagueTeamIDs(leagueID: string, teams: TeamDTO[]): { leagueID: string; ids: string[] }[] {
		const teamIDs = teams.map((t) => t.id);
		return [{ leagueID: leagueID, ids: teamIDs }];
	}

	private mapSportTypeDTOToSportType(sportTypeDTO: SportTypeDTO): SportType {
		return {
			id: sportTypeDTO.id,
			leagues: sportTypeDTO.leagues.map((l) => l.id),
			name: sportTypeDTO.name
		};
	}

	private mapLeagueDTOToLeague(leagueDTO: LeagueDTO): League {
		return {
			id: leagueDTO.id,
			name: leagueDTO.name,
			selected: leagueDTO.selected,
			sportTypeID: leagueDTO.sportTypeID,
			sessionIDs: leagueDTO.sessions !== null ? leagueDTO.sessions.map((s) => s.id) : undefined,
			teams: leagueDTO.teams.map((t) => t.id)
		};
	}
}
