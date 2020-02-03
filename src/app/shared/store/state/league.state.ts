import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { League } from 'src/app/core/models/schedule/league.model';
import { UNASSIGNED } from 'src/app/shared/constants/the-p-league-constants';
import * as Leagues from 'src/app/shared/store/actions/leagues.actions';
import { updateEntity } from '../helpers/state-helpers';

export interface LeagueStateModel {
	entities: {
		[id: string]: League;
	};
}

@State<LeagueStateModel>({
	name: 'leagues',
	defaults: {
		entities: {}
	}
})
export class LeagueState {
	constructor() {}

	/**
	 * @description Retrieves all leagues from the store
	 * @param state
	 * @returns leagues
	 */
	@Selector()
	static getLeagues(state: LeagueStateModel): League[] {
		return Object.values(state.entities);
	}

	/**
	 * @description Retrieves all selected leagues from the store
	 * @param state
	 * @returns selected leagues
	 */
	@Selector()
	static getSelectedLeagues(state: LeagueStateModel): League[] {
		return Object.values(state.entities).filter((l) => l.selected);
	}

	/**
	 * @description Returns filter function to the consumer, which allows
	 * for returning list of leagues matching passed in sport type id
	 * @param state
	 * @returns leagues for sport type idfn
	 */
	@Selector()
	static getLeaguesForSportTypeIDFn(state: LeagueStateModel): (id: string) => League[] {
		return (id: string): League[] => Object.values(state.entities).filter((l) => l.sportTypeID === id);
	}

	/**
	 * @description Selects team ids for the given league ids
	 * @param state
	 * @returns team ids for league ids fn
	 */
	@Selector()
	static getTeamIDsForLeagueIDsFn(state: LeagueStateModel): (leagueIDs: string[]) => string[] {
		return (leagueIDs: string[]): string[] => leagueIDs.reduce((acc, curr) => acc.concat(state.entities[curr].teams), [] as string[]);
	}

	/**
	 * @description Initializes the leagues collection. The incoming league entities
	 * are already in a normalized state
	 * @param ctx
	 * @param action
	 */
	@Action(Leagues.InitializeLeagues)
	initializeLeagues(ctx: StateContext<LeagueStateModel>, action: Leagues.InitializeLeagues): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				draft.entities = action.leagues;
			})
		);
	}

	/**
	 * @description Adds the given league to the store
	 * @param ctx
	 * @param action
	 */
	@Action(Leagues.AddLeague)
	add(ctx: StateContext<LeagueStateModel>, action: Leagues.AddLeague): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				draft.entities[action.newLeague.id] = action.newLeague;
				// initialize the teams array to avoid unforseen errors. Whenever adding leagues, currently
				// the app will neveer send teams along with it
				draft.entities[action.newLeague.id].teams = [];
			})
		);
	}

	/**
	 * @description Adds the given team ids to the passed in league
	 * @param ctx
	 * @param action
	 */
	@Action(Leagues.AddTeamIDsToLeague)
	addTeamIDs(ctx: StateContext<LeagueStateModel>, action: Leagues.AddTeamIDsToLeague): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				action.payload.forEach((pair) => {
					if (pair.leagueID !== UNASSIGNED) {
						// ensure we are not adding duplicates
						pair.ids.forEach((id) => {
							if (!draft.entities[pair.leagueID].teams.includes(id)) {
								(draft.entities[pair.leagueID].teams || []).push(id);
							}
						});
					}
				});
			})
		);
	}

	/**
	 * @description Updates the passed in league
	 * @param ctx
	 * @param action
	 */
	@Action(Leagues.UpdateLeagues)
	update(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateLeagues): void {
		console.log('updating local state');
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				action.updatedLeagues.forEach((updatedLeague) => {
					draft.entities[updatedLeague.id] = updateEntity(updatedLeague, draft.entities[updatedLeague.id]);
				});
			})
		);
	}

	/**
	 * @description Updates only selected leagues
	 * @param ctx
	 * @param action
	 */
	@Action(Leagues.UpdateSelectedLeagues)
	updatedSelected(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateSelectedLeagues): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				action.effected.forEach((effectedID) => {
					if (action.selected.some((selectedID) => selectedID === effectedID)) {
						draft.entities[effectedID].selected = true;
					} else {
						draft.entities[effectedID].selected = false;
					}
				});
			})
		);
	}

	/**
	 * @description Deletes the passed in league from the store
	 * @param ctx
	 * @param action
	 */
	@Action(Leagues.DeleteLeagues)
	delete(ctx: StateContext<LeagueStateModel>, action: Leagues.DeleteLeagues): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				action.deleteIDs.forEach((deleteID) => {
					delete draft.entities[deleteID];
				});
			})
		);
	}

	/**
	 * @description Deletes team ids from the passed in league
	 * @param ctx
	 * @param action
	 */
	@Action(Leagues.DeleteTeamIDsFromLeague)
	deleteTeamIDs(ctx: StateContext<LeagueStateModel>, action: Leagues.DeleteTeamIDsFromLeague): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				action.deleteIDs.forEach((deleteID) => {
					const index = draft.entities[action.leagueID].teams.indexOf(deleteID);
					if (index !== 1) {
						draft.entities[action.leagueID].teams.splice(index, 1);
					}
				});
			})
		);
	}
}
