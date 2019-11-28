import { UNASSIGNED } from 'src/app/helpers/Constants/ThePLeagueConstants';
import { Leagues } from 'src/app/store/actions/leagues.actions';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { updateEntity } from './state-helpers';
import produce from 'immer';

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
  static getAll(state: LeagueStateModel) {
    return Object.values(state.entities);
  }

  @Selector()
  static getSelected(state: LeagueStateModel) {
    return Object.values(state.entities).filter(l => l.selected);
  }

  @Selector()
  static getAllForSportTypeID(state: LeagueStateModel) {
    return (id: string) => Object.values(state.entities).filter(l => l.sportTypeID === id);
  }

  @Action(Leagues.InitializeLeagues)
  initializeLeagues(ctx: StateContext<LeagueStateModel>, action: Leagues.InitializeLeagues) {
    ctx.setState(
      produce((draft: LeagueStateModel) => {
        draft.entities = action.leagues;
        draft.IDs = Object.keys(action.leagues).map(id => id);
      })
    );
  }

  @Action(Leagues.AddLeague)
  add(ctx: StateContext<LeagueStateModel>, action: Leagues.AddLeague) {
    ctx.setState(
      produce((draft: LeagueStateModel) => {
        draft.entities[action.newLeague.id] = action.newLeague;
        draft.IDs.push(action.newLeague.id);
      })
    );
    console.log('what is state', ctx.getState().entities);
  }

  @Action(Leagues.AddTeamIDsToLeague)
  addTeamIDs(ctx: StateContext<LeagueStateModel>, action: Leagues.AddTeamIDsToLeague) {
    ctx.setState(
      produce((draft: LeagueStateModel) => {
        action.payload.forEach(pair => {
          if (pair.leagueID !== UNASSIGNED) {
            draft.entities[pair.leagueID].teams = (draft.entities[pair.leagueID].teams || []).concat([pair.ids]);
          }
        });
      })
    );
  }

  @Action(Leagues.UpdateLeagues)
  update(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateLeagues) {
    ctx.setState(
      produce((draft: LeagueStateModel) => {
        action.updatedLeagues.forEach(updatedLeague => {
          draft.entities[updatedLeague.id] = updateEntity(updatedLeague, draft.entities[updatedLeague.id]);
        });
      })
    );
  }

  @Action(Leagues.UpdateSelectedLeagues)
  updatedSelected(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateSelectedLeagues) {
    ctx.setState(
      produce((draft: LeagueStateModel) => {
        action.effected.forEach(effectedID => {
          if (action.selected.some(selectedID => selectedID === effectedID)) {
            draft.entities[effectedID].selected = true;
          } else {
            draft.entities[effectedID].selected = false;
          }
        });
      })
    );
  }

  @Action(Leagues.DeleteLeagues)
  delete(ctx: StateContext<LeagueStateModel>, action: Leagues.DeleteLeagues) {
    ctx.setState(
      produce((draft: LeagueStateModel) => {
        action.deleteIDs.forEach(deleteID => {
          delete draft.entities[deleteID];
          draft.IDs = draft.IDs.filter(id => id !== deleteID);
        });
      })
    );
  }

  @Action(Leagues.DeleteTeamIDsFromLeague)
  deleteTeamIDs(ctx: StateContext<LeagueStateModel>, action: Leagues.DeleteTeamIDsFromLeague) {
    ctx.setState(
      produce((draft: LeagueStateModel) => {
        action.deleteIDs.forEach(deleteID => {
          const index = draft.entities[action.leagueID].teams.indexOf(deleteID);
          if (index !== 1) {
            draft.entities[action.leagueID].teams.splice(index, 1);
          }
        });
      })
    );
  }
}
