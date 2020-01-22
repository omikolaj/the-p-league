import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import * as Sports from '../actions/sports.actions';
import { updateEntity } from '../helpers/state-helpers';
import { LeagueState, LeagueStateModel } from './league.state';

export interface SportTypeStateModel {
	entities: {
		[id: string]: SportType;
	};
}

@State<SportTypeStateModel>({
	name: 'types',
	defaults: {
		entities: {}
	}
})
export class SportTypeState {
	constructor(private scheduleAdminAsyncService: ScheduleAdministrationAsyncService) {}

	/**
	 * @description Selects all of the sport type entities
	 * @param state
	 * @returns sport types
	 */
	@Selector()
	static getSportTypes(state: SportTypeStateModel): SportType[] {
		return Object.values(state.entities);
	}

	/**
	 * @description Selectors the sport type entity by its id
	 * @param state
	 * @returns sport type by id
	 */
	@Selector()
	static getSportTypeByID(state: SportTypeStateModel): (id: string) => SportType {
		return (id: string): SportType => Object.values(state.entities).find((s) => s.id === id);
	}

	/**
	 * @description Selects SportTypeLeaguePairs for every sport type and
	 * every league in the store by joining SportTypeState and LeagueState together
	 * @param state
	 * @param leagueState
	 * @returns sport types leagues pairs
	 */
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

	/**
	 * @description Initializes the sport type state.
	 * The incoming payload of sport types has already been normalized
	 * @param ctx
	 * @param action
	 */
	@Action(Sports.InitializeSports)
	initializeSports(ctx: StateContext<SportTypeStateModel>, action: Sports.InitializeSports): void {
		ctx.setState(
			produce((draft: SportTypeStateModel) => {
				draft.entities = action.sports;
			})
		);
	}

	/**
	 * @description Adds sport type to the store
	 * @param ctx
	 * @param action
	 */
	@Action(Sports.AddSportType)
	add(ctx: StateContext<SportTypeStateModel>, action: Sports.AddSportType): void {
		ctx.setState(
			produce((draft: SportTypeStateModel) => {
				// no need to check if this item already exists, it will simply be replaced
				draft.entities[action.newSportType.id] = action.newSportType;
				// initialize the leagues array if it is not already initialized
				draft.entities[action.newSportType.id].leagues = draft.entities[action.newSportType.id].leagues || [];
			})
		);
	}

	/**
	 * @description Adds the specified league IDs to the specified sport type
	 * leagues property
	 * @param ctx
	 * @param action
	 */
	@Action(Sports.AddLeagueIDsToSportType)
	addLeagueIDs(ctx: StateContext<SportTypeStateModel>, action: Sports.AddLeagueIDsToSportType): void {
		ctx.setState(
			produce((draft: SportTypeStateModel) => {
				action.payload.forEach((pair) => {
					// we want to make sure we are not adding duplicate values
					pair.ids.forEach((id) => {
						// check to see if item alredy exists
						if (!(draft.entities[pair.sportTypeID].leagues || []).includes(id)) {
							// in case we have not initialized the leagues array, initialize it than add the league id
							draft.entities[pair.sportTypeID].leagues = (draft.entities[pair.sportTypeID].leagues || []).concat(id);
						}
					});
				});
			})
		);
	}

	/**
	 * @description Updates the passed in sport type
	 * @param ctx
	 * @param action
	 */
	@Action(Sports.UpdateSportType)
	update(ctx: StateContext<SportTypeStateModel>, action: Sports.UpdateSportType): void {
		ctx.setState(
			produce((draft: SportTypeStateModel) => {
				draft.entities[action.updatedSportType.id] = updateEntity(action.updatedSportType, draft.entities[action.updatedSportType.id]);
			})
		);
	}

	/**
	 * @description Deletes the passed in sport type from the store
	 * @param ctx
	 * @param action
	 */
	@Action(Sports.DeleteSportType)
	delete(ctx: StateContext<SportTypeStateModel>, action: Sports.DeleteSportType): void {
		ctx.setState(
			produce((draft) => {
				delete draft.entities[action.id];
			})
		);
	}

	/**
	 * @description deletes the passed in league IDs from the specified
	 * sport type leagues property
	 * @param ctx
	 * @param action
	 */
	@Action(Sports.DeleteLeagueIDsFromSportType)
	deleteLeagueIDsFromSportType(ctx: StateContext<SportTypeStateModel>, action: Sports.DeleteLeagueIDsFromSportType): void {
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
}
