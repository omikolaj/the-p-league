import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import { Team } from 'src/app/core/models/schedule/team.model';
import { UNASSIGNED } from 'src/app/shared/constants/the-p-league-constants';
import * as Teams from '../actions/teams.actions';
import { updateEntity } from '../helpers/state-helpers';

export interface TeamStateModel {
	entities: {
		[id: string]: Team;
	};
}

@State<TeamStateModel>({
	name: 'teams',
	defaults: {
		entities: {}
	}
})
@Injectable()
export class TeamState {
	constructor() {}

	/**
	 * @description Selects all unassigned teams
	 * @param state
	 * @returns unassigned teams
	 */
	@Selector()
	static getUnassignedTeams(state: TeamStateModel): Team[] {
		return Object.values(state.entities).filter((t) => t.leagueID === UNASSIGNED);
	}

	/**
	 * @description Returns filter function that allows consumer for retrieving
	 * list of teams for the specified league id
	 * @param state
	 * @returns teams for league id
	 */
	@Selector()
	static getTeamsForLeagueIDFn(state: TeamStateModel): (id: string) => Team[] {
		return (id: string): Team[] => {
			return Object.values(state.entities).filter((t) => t.leagueID === id);
		};
	}

	/**
	 * @description Initial action that is triggered to initialize the teams collection
	 * The incoming collection of teams is already normalized with noramlize by the resolver
	 * @param ctx
	 * @param action
	 */
	@Action(Teams.InitializeTeams)
	initializeTeams(ctx: StateContext<TeamStateModel>, action: Teams.InitializeTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				draft.entities = action.teams;
			})
		);
	}

	/**
	 * @description Adds unassigned teams
	 * @param ctx
	 * @param action
	 */
	@Action(Teams.AddUnassignedTeams)
	addTeams(ctx: StateContext<TeamStateModel>, action: Teams.AddUnassignedTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				action.teams.forEach((unassigned) => {
					draft.entities[unassigned.id] = unassigned;
				});
			})
		);
	}

	/**
	 * @description Adds the team to the store
	 * @param ctx
	 * @param action
	 */
	@Action(Teams.AddTeam)
	add(ctx: StateContext<TeamStateModel>, action: Teams.AddTeam): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				draft.entities[action.newTeam.id] = action.newTeam;
			})
		);
	}

	/**
	 * @description Updates the given team's info
	 * @param ctx
	 * @param action
	 */
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

	/**
	 * @description Updates only selected teams
	 * @param ctx
	 * @param action
	 */
	@Action(Teams.UpdateSelectedTeams)
	updateSelected(ctx: StateContext<TeamStateModel>, action: Teams.UpdateSelectedTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				Object.values(draft.entities).forEach((team) => {
					if (team.leagueID === action.leagueID) {
						if (action.selected.some((selectedID) => selectedID === team.id)) {
							team.selected = true;
						} else {
							team.selected = false;
						}
					}
				});
			})
		);
	}

	/**
	 * @description Assigns the teams in the payload to assigned league ids
	 * @param ctx
	 * @param action
	 */
	@Action(Teams.AssignTeams)
	assign(ctx: StateContext<TeamStateModel>, action: Teams.AssignTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				action.assignTeams.forEach((team) => {
					draft.entities[team.id].leagueID = team.leagueID;
					draft.entities[team.id].selected = true;
				});
			})
		);
	}

	/**
	 * @description Unassigns the teams in the payload. Marks each team in the
	 * payload 'leagueID' property to '-1' (UNASSIGNED), and marks the team as not
	 * selected
	 * @param ctx
	 * @param action
	 */
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

	/**
	 * @description Deletes the passed in team from the store
	 * @param ctx
	 * @param action
	 */
	@Action(Teams.DeleteTeams)
	delete(ctx: StateContext<TeamStateModel>, action: Teams.DeleteTeams): void {
		ctx.setState(
			produce((draft: TeamStateModel) => {
				action.deleteIDs.forEach((deleteID) => {
					delete draft.entities[deleteID];
				});
			})
		);
	}
}
