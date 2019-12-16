import { Action, Selector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import { Team } from 'src/app/core/models/schedule/team.model';
import { UNASSIGNED } from 'src/app/shared/helpers/constants/the-p-league-constants';
import * as Teams from '../actions/teams.actions';
import { updateEntity } from '../helpers/state-helpers';

export interface TeamStateModel {
	entities: {
		[id: string]: Team;
	};
	IDs: string[];
}

@State<TeamStateModel>({
	name: 'teams',
	defaults: {
		entities: {},
		IDs: []
	}
})
export class TeamState {
	constructor() {}

	@Selector()
	static getUnassigned(state: TeamStateModel): Team[] {
		return Object.values(state.entities).filter((t) => t.leagueID === UNASSIGNED);
	}

	@Selector()
	static getAllForLeagueID(state: TeamStateModel) {
		return (id: string): Team[] => {
			return Object.values(state.entities).filter((t) => t.leagueID === id);
		};
	}

	@Action(Teams.InitializeTeams)
	initializeTeams(ctx: StateContext<TeamStateModel>, action: Teams.InitializeTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				draft.entities = action.teams;
				draft.IDs = Object.keys(action.teams).map((id) => id);
			})
		);
	}

	@Action(Teams.AddTeam)
	add(ctx: StateContext<TeamStateModel>, action: Teams.AddTeam): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				draft.entities[action.newTeam.id] = action.newTeam;
				draft.IDs.push(action.newTeam.id);
			})
		);
	}

	@Action(Teams.UpdateTeams)
	update(ctx: StateContext<TeamStateModel>, action: Teams.UpdateTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				action.updatedTeams.forEach((updatedTeam) => {
					const entityUpdated = updateEntity(updatedTeam, draft.entities[updatedTeam.id]);
					draft.entities[entityUpdated.id] = entityUpdated;
				});
			})
		);
	}

	@Action(Teams.UpdateSelectedTeams)
	updateSelected(ctx: StateContext<TeamStateModel>, action: Teams.UpdateSelectedTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
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

	@Action(Teams.AssignTeams)
	assign(ctx: StateContext<TeamStateModel>, action: Teams.AssignTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				action.assignTeams.forEach((team) => {
					draft.entities[team.id].leagueID = team.leagueID;
					draft.entities[team.id].selected = false;
				});
			})
		);
	}

	@Action(Teams.UnassignTeams)
	unassign(ctx: StateContext<TeamStateModel>, action: Teams.UnassignTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				action.unassignIDs.forEach((unassignID) => {
					draft.entities[unassignID].leagueID = UNASSIGNED;
					draft.entities[unassignID].selected = false;
				});
			})
		);
	}

	@Action(Teams.DeleteTeams)
	delete(ctx: StateContext<TeamStateModel>, action: Teams.DeleteTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				action.deleteIDs.forEach((deleteID) => {
					delete draft.entities[deleteID];
					draft.IDs = draft.IDs.filter((id) => id !== deleteID);
				});
			})
		);
	}
}
