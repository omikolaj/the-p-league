import { TeamStateModel } from './team.state';
import { log } from 'util';
import { Leagues } from 'src/app/store/actions/league.actions';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { SportTypeState } from './sport-type.state';
import { State, Selector, Action, StateContext, Store, createSelector } from '@ngxs/store';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { patch, append, removeItem } from '@ngxs/store/operators';
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
  private static readonly Unassigned = '-1';
  constructor() {}

  @Selector()
  static getTeams(state: TeamStateModel) {
    const teams: Team[] = [];
    Object.values(state.entities).forEach(t => {
      teams.push(t);
    });
    return teams;
  }

  @Selector()
  static getUnassigned(state: TeamStateModel) {
    const unassignedTeams: Team[] = [];
    Object.values(state.entities).forEach(t => {
      if (t.leagueID === this.Unassigned) {
        unassignedTeams.push(t);
      }
    });
    return unassignedTeams;
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

  @Action(Teams.UnassignTeams)
  unassign(ctx: StateContext<TeamStateModel>, action: Teams.UnassignTeams) {
    const state = ctx.getState();
    for (let index = 0; index < action.unassignIDs.length; index++) {
      const unassignID = action.unassignIDs[index];
      const unassignTeam: Team = { ...Object.values(state.entities).find(t => t.id === unassignID) };
      if (unassignTeam) {
        unassignTeam.leagueID = '-1';
        unassignTeam.selected = false;
        ctx.setState(
          patch<TeamStateModel>({
            entities: patch({
              [unassignTeam.id]: unassignTeam
            })
          })
        );
      }
    }
  }

  @Action(Teams.DeleteTeams)
  /**
   * @param  {StateContext<TeamStateModel>} ctx
   * @param  {Teams.DeleteTeams} action
   * This approach seems more efficient of deleting things
   * It has more code because we have to copy frozen objects
   */
  delete(ctx: StateContext<TeamStateModel>, action: Teams.DeleteTeams) {
    const state = {
      ...ctx.getState()
    };
    for (let index = 0; index < action.deleteIDs.length; index++) {
      const deleteID = action.deleteIDs[index];
      const deleteTeam: Team = Object.values(state.entities).find(t => t.id === deleteID);
      if (deleteTeam) {
        state.entities = { ...state.entities };
        state.entities[deleteID] = { ...state.entities[deleteID] };
        delete state.entities[deleteID];
        ctx.setState(
          patch<TeamStateModel>({
            entities: state.entities,
            IDs: removeItem(id => id === deleteID)
          })
        );
      }
    }
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
