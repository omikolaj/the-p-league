import { TeamStateModel } from './team.state';
import { log } from 'util';
import { Leagues } from 'src/app/store/actions/league.actions';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { SportTypeState } from './sport-type.state';
import { State, Selector, Action, StateContext, Store, createSelector } from '@ngxs/store';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { patch, append } from '@ngxs/store/operators';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { LeagueStateModel } from './league.state';
import { Teams } from '../actions/team.actions';

export interface TeamStateModel {
  entities: {
    [id: string]: Team;
  };
  IDs: string[];
  loading?: boolean;
  error?: any;
}

@State<TeamStateModel>({
  name: 'teams',
  defaults: {
    entities: {},
    IDs: [],
    loading: false
  }
})
export class TeamState {
  constructor() {}

  @Selector()
  static getTeams(state: TeamStateModel) {
    const teams: Team[] = [];
    Object.values(state.entities).map(t => {
      teams.push(t);
    });
    return teams;
  }

  @Selector()
  static getAllTeamsForLeagueID(state: TeamStateModel) {
    return (id: string) => {
      const teamsMatch: Team[] = [];
      Object.values(state.entities).forEach(t => {
        if (t.leagueID === id) {
          teamsMatch.push(t);
        }
      });
      return teamsMatch;
    };
  }

  static getTeamsForLeagueID(id: string) {
    return createSelector([TeamState], (state: TeamStateModel) => {
      const teams: Team[] = [];
      Object.values(state.entities).forEach(t => {
        if (t.leagueID === id) {
          teams.push(t);
        }
      });
      return teams;
    });
  }

  static getSelectedTeamIDsForLeagueID(id: string) {
    return createSelector([TeamState], (state: TeamStateModel) => {
      const selectedTeamIDs: string[] = [];
      Object.values(state.entities).forEach(t => {
        if (t.leagueID === id) {
          if (t.selected) {
            selectedTeamIDs.push(t.id);
          }
        }
      });
      return selectedTeamIDs;
    });
  }

  @Action(Teams.AddTeams)
  addTeams(ctx: StateContext<TeamStateModel>, action: Teams.AddTeams) {
    action.teams.forEach(t => {
      ctx.setState(
        patch<TeamStateModel>({
          entities: patch({ [t.id]: t }),
          IDs: append([t.id])
        })
      );
    });
  }

  @Action(Teams.AddTeam)
  add(ctx: StateContext<TeamStateModel>, action: Teams.AddTeam) {
    ctx.setState(
      patch<TeamStateModel>({
        entities: patch({ [action.newTeam.id]: action.newTeam }),
        IDs: append([action.newTeam.id])
      })
    );
  }

  @Action(Teams.UpdateTeams)
  update(ctx: StateContext<TeamStateModel>, action: Teams.UpdateTeams) {
    action.updatedTeams.forEach(updatedTeam => {
      ctx.setState(
        patch<TeamStateModel>({
          entities: patch({
            [updatedTeam.id]: updatedTeam
          })
        })
      );
    });
  }

  @Action(Teams.DeleteTeams)
  delete(ctx: StateContext<TeamStateModel>, action: Teams.DeleteTeams) {
    const state = ctx.getState();
    const updatedTeamEntities = {};
    const updatedIDs = [];
    for (let index = 0; index < Object.keys(state.entities).length; index++) {
      const keepID = Object.keys(state.entities)[index];
      if (!action.deleteIDs.includes(keepID)) {
        updatedTeamEntities[keepID] = { ...state.entities[keepID] };
        updatedIDs.push(keepID);
      }
    }
    ctx.patchState({
      ...state,
      entities: updatedTeamEntities,
      IDs: updatedIDs
    });
  }

  @Action(Teams.UpdateSelectedTeams)
  updateSelected(ctx: StateContext<TeamStateModel>, action: Teams.UpdateSelectedTeams) {
    const state = {
      ...ctx.getState(),
      entities: { ...ctx.getState().entities }
    };
    for (let index = 0; index < Object.values(state.entities).length; index++) {
      const team: Team = { ...Object.values(state.entities)[index] };
      if (team.leagueID === action.leagueID) {
        if (action.selected.some(selectedID => selectedID === team.id)) {
          team.selected = true;
        } else {
          team.selected = false;
        }
        state.entities[team.id] = team;
      }
    }

    ctx.setState(
      patch<TeamStateModel>({
        entities: state.entities
      })
    );
  }
}