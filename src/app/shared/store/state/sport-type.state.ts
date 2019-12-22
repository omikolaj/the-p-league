import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import produce from 'immer';
import { normalize } from 'normalizr';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import * as Leagues from 'src/app/shared/store/actions/leagues.actions';
import * as Teams from 'src/app/shared/store/actions/teams.actions';
import * as Sports from '../actions/sports.actions';
import { updateEntity } from '../helpers/state-helpers';
import { sportListSchema } from '../schema/schema';
import { LeagueState, LeagueStateModel } from './league.state';

export interface SportTypeStateModel {
	entities: {
		[id: string]: SportType;
	};
	IDs: string[];
}

@State<SportTypeStateModel>({
	name: 'types',
	defaults: {
		entities: {},
		IDs: []
	}
})
export class SportTypeState {
	constructor(private scheduleAdminAsyncService: ScheduleAdministrationAsyncService) {}

	@Selector()
	static getSportTypes(state: SportTypeStateModel): SportType[] {
		return Object.values(state.entities);
	}

	@Selector()
	static getSportTypeByID(state: SportTypeStateModel): (id: string) => SportType {
		return (id: string): SportType => Object.values(state.entities).find((s) => s.id === id);
	}

	@Selector([SportTypeState, LeagueState])
	static getSportTypesLeaguesPairs(state: SportTypeStateModel, leagueState: LeagueStateModel): SportTypesLeaguesPairs[] {
		const pairs: SportTypesLeaguesPairs[] = [];

		Object.values(state.entities).forEach((s) => {
			pairs.push({
				id: s.id,
				name: s.name,
				leagues: []
			});
		});

		Object.values(leagueState.entities).forEach((l) => {
			pairs.forEach((pair) => {
				if (pair.id === l.sportTypeID) {
					pair.leagues.push({
						id: l.id,
						name: l.name
					});
				}
			});
		});
		return pairs;
	}

	// #region FetchAll

	@Action(Sports.FetchAllSportTypes)
	fetchAll(ctx: StateContext<SportTypeStateModel>): Observable<void> {
		return this.scheduleAdminAsyncService.fetchAllSportTypes().pipe(
			map((fetchedSportTypes) => normalize(fetchedSportTypes, sportListSchema)),
			tap((normalizedData) => {
				ctx.setState(
					patch<SportTypeStateModel>({
						entities: normalizedData.entities['sports'],
						IDs: normalizedData.result
					})
				);
			}),
			tap((normalizedData) => ctx.dispatch(new Leagues.InitializeLeagues(normalizedData.entities['leagues']))),
			tap((normalizedData) => ctx.dispatch(new Teams.InitializeTeams(normalizedData.entities['teams']))),
			switchMap(() => ctx.dispatch(new Sports.FetchAllSportTypesSuccess())),
			catchError((err) => ctx.dispatch(new Sports.FetchAllSportTypesFailed(err)))
		);
	}

	/**
	 * @param  {} Sports.FetchAllSportTypesSuccess
	 *
	 * TODO remove these when replaced
	 * Currently used in the resolver, even though it is empty method
	 */
	@Action(Sports.FetchAllSportTypesSuccess)
	fetchSuccess(ctx: StateContext<SportTypeStateModel>): void {}

	/**
	 * @param  {} Sports.FetchAllSportTypesFailed
	 *
	 * TODO remove these when replaced
	 * Currently used in the resolver, even though it is empty method
	 */
	@Action(Sports.FetchAllSportTypesFailed)
	fetchFailed(ctx: StateContext<SportTypeStateModel>, action: Sports.FetchAllSportTypesFailed): void {}

	// #endregion

	// #region Add

	@Action(Sports.AddSportType)
	add(ctx: StateContext<SportTypeStateModel>, action: Sports.AddSportType): void {
		ctx.setState(
			produce((draft: SportTypeStateModel) => {
				draft.entities[action.newSportType.id] = action.newSportType;
				// initialize the leagues array if it is not already initialized
				draft.entities[action.newSportType.id].leagues = draft.entities[action.newSportType.id].leagues || [];
				draft.IDs.push(action.newSportType.id);
			})
		);
	}

	@Action(Sports.AddLeagueIDsToSportType)
	addLeagueIDs(ctx: StateContext<SportTypeStateModel>, action: Sports.AddLeagueIDsToSportType): void {
		ctx.setState(
			produce((draft: SportTypeStateModel) => {
				action.payload.forEach((pair) => {
					// in case we have not initialized the leagues array, initialize it than add the league id
					draft.entities[pair.sportTypeID].leagues = (draft.entities[pair.sportTypeID].leagues || []).concat(pair.ids);
				});
			})
		);
	}

	// #endregion

	// #region Update

	@Action(Sports.UpdateSportType)
	update(ctx: StateContext<SportTypeStateModel>, action: Sports.UpdateSportType): void {
		ctx.setState(
			produce((draft: SportTypeStateModel) => {
				draft.entities[action.updatedSportType.id] = updateEntity(action.updatedSportType, draft.entities[action.updatedSportType.id]);
			})
		);
	}
	// #endregion

	// #region Delete

	@Action(Sports.DeleteSportType)
	delete(ctx: StateContext<SportTypeStateModel>, action: Sports.DeleteSportType): void {
		ctx.setState(
			produce((draft) => {
				delete draft.entities[action.id];
				draft.IDs = draft.IDs.filter((id) => id !== action.id);
			})
		);
	}

	@Action(Sports.DeleteLeagueIDsFromSportType)
	addSportTypeID(ctx: StateContext<SportTypeStateModel>, action: Sports.DeleteLeagueIDsFromSportType): void {
		ctx.setState(
			produce((draft: SportTypeStateModel) => {
				action.deleteIDs.forEach((deleteID) => {
					const index = draft.entities[action.sportTypeID].leagues.indexOf(deleteID);
					if (index !== -1) {
						draft.entities[action.sportTypeID].leagues.splice(index, 1);
					}
				});
			})
		);
	}

	// #endregion
}