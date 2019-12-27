import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { League } from 'src/app/core/models/schedule/league.model';
import { UNASSIGNED } from 'src/app/shared/helpers/constants/the-p-league-constants';
import * as Leagues from 'src/app/shared/store/actions/leagues.actions';
import { updateEntity } from '../helpers/state-helpers';

export interface LeagueStateModel {
	entities: {
		[id: string]: League;
	};
	IDs: string[];
}

@State<LeagueStateModel>({
	name: 'leagues',
	defaults: {
		entities: {},
		IDs: []
	}
})
export class LeagueState {
	constructor() {}

	@Selector()
	static getAll(state: LeagueStateModel): League[] {
		return Object.values(state.entities);
	}

	@Selector()
	static getSelected(state: LeagueStateModel): League[] {
		return Object.values(state.entities).filter((l) => l.selected);
	}

	@Selector()
	static getAllForSportTypeID(state: LeagueStateModel) {
		return (id: string): League[] => Object.values(state.entities).filter((l) => l.sportTypeID === id);
	}

	@Action(Leagues.InitializeLeagues)
	initializeLeagues(ctx: StateContext<LeagueStateModel>, action: Leagues.InitializeLeagues): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				draft.entities = action.leagues;
				draft.IDs = Object.keys(action.leagues).map((id) => id);
			})
		);
		console.log('leagues state', ctx.getState().entities);
	}

	@Action(Leagues.AddLeague)
	add(ctx: StateContext<LeagueStateModel>, action: Leagues.AddLeague): void {
		console.log('incoming ', action.newLeague);
		console.log('logging state  before', ctx.getState().entities);
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				draft.entities[action.newLeague.id] = action.newLeague;
				draft.IDs.push(action.newLeague.id);
			})
		);
		console.log('logging state  after', ctx.getState().entities);
	}

	@Action(Leagues.AddTeamIDsToLeague)
	addTeamIDs(ctx: StateContext<LeagueStateModel>, action: Leagues.AddTeamIDsToLeague): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				action.payload.forEach((pair) => {
					if (pair.leagueID !== UNASSIGNED) {
						draft.entities[pair.leagueID].teams = (draft.entities[pair.leagueID].teams || []).concat(pair.ids);
					}
				});
			})
		);
	}

	@Action(Leagues.UpdateLeagues)
	update(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateLeagues): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				action.updatedLeagues.forEach((updatedLeague) => {
					draft.entities[updatedLeague.id] = updateEntity(updatedLeague, draft.entities[updatedLeague.id]);
				});
			})
		);
	}

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

	@Action(Leagues.DeleteLeagues)
	delete(ctx: StateContext<LeagueStateModel>, action: Leagues.DeleteLeagues): void {
		ctx.setState(
			produce((draft: LeagueStateModel) => {
				action.deleteIDs.forEach((deleteID) => {
					delete draft.entities[deleteID];
					draft.IDs = draft.IDs.filter((id) => id !== deleteID);
				});
			})
		);
	}

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
