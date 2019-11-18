import { TeamStateModel } from './team.state';
import { State, Selector, Action, StateContext, createSelector } from '@ngxs/store';
import { patch, append, removeItem } from '@ngxs/store/operators';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { Teams } from '../actions/team.actions';
import { UNASSIGNED } from 'src/app/helpers/Constants/ThePLeagueConstants';
import { updateTeam } from './state-helpers';

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
    Object.values(state.entities).forEach(t => {
      teams.push(t);
    });
    return teams;
  }

  @Selector()
  static getUnassigned(state: TeamStateModel) {
    const unassignedTeams: Team[] = [];
    Object.values(state.entities).forEach(t => {
      if (t.leagueID === UNASSIGNED) {
        unassignedTeams.push(t);
      }
    });
    return unassignedTeams;
  }

  @Selector()
  static getAllTeamsForLeagueID(state: TeamStateModel) {
    return (id: string) => {
      console.log('returning teams begin');
      const teamsMatch: Team[] = [];
      Object.values(state.entities).forEach(t => {
        if (t.leagueID === id) {
          teamsMatch.push(t);
        }
      });
      console.log(`returning teams for id ${id}`, teamsMatch);
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
    // copy over the state
    const state = { ...ctx.getState(), entities: { ...ctx.getState().entities } };
    action.updatedTeams.forEach(updatedTeam => {
      // copy over specific entity object
      const existingTeam: Team = { ...state.entities[updatedTeam.id] };
      // delete the entity object from the current entities list, because
      // we will be inserting an updated one in its place
      delete state.entities[updatedTeam.id];
      // get updated team
      const updated = updateTeam(updatedTeam, existingTeam);
      // insert the updated team
      state.entities[updated.id] = updated;
    });
    // perform a single store update reducing number of change detection cycles
    ctx.setState(
      patch({
        ...state,
        entities: state.entities
      })
    );
  }

  @Action(Teams.UnassignTeams)
  unassign(ctx: StateContext<TeamStateModel>, action: Teams.UnassignTeams) {
    const state = ctx.getState();
    for (let index = 0; index < action.unassignIDs.length; index++) {
      const unassignID = action.unassignIDs[index];
      const unassignTeam: Team = { ...Object.values(state.entities).find(t => t.id === unassignID) };
      if (unassignTeam) {
        unassignTeam.leagueID = UNASSIGNED;
        unassignTeam.selected = false;
        //TODO updating state one by one will cause new value to be emitted
        // it would be better to do it in bulk
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

  @Action(Teams.AssignTeams)
  assign(ctx: StateContext<TeamStateModel>, action: Teams.AssignTeams) {
    const state = ctx.getState();
    for (let index = 0; index < action.assignTeams.length; index++) {
      const team = action.assignTeams[index];
      const changeAssignmentTeam: Team = { ...Object.values(state.entities).find(t => t.id === team.id) };
      if (changeAssignmentTeam) {
        changeAssignmentTeam.leagueID = team.leagueID;
        changeAssignmentTeam.selected = false;
        //TODO updating state one by one will cause new value to be emitted
        // it would be better to do it in bulk
        ctx.setState(
          patch<TeamStateModel>({
            entities: patch({
              [changeAssignmentTeam.id]: changeAssignmentTeam
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
