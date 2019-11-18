import { Leagues } from 'src/app/store/actions/league.actions';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { SportTypeState } from './sport-type.state';
import { State, Selector, Action, StateContext, Store, createSelector } from '@ngxs/store';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { patch, append } from '@ngxs/store/operators';
import { updateLeague } from './state-helpers';

export interface LeagueStateModel {
  entities: {
    [id: string]: League;
  };
  IDs: string[];
  selected: League[];
  loading?: boolean;
  error?: any;
}

@State<LeagueStateModel>({
  name: 'leagues',
  defaults: {
    entities: {},
    IDs: [],
    selected: [],
    loading: false
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
    const selectedLeagues: League[] = [];
    Object.values(state.entities).map(l => {
      if (l.selected) {
        selectedLeagues.push(l);
      }
    });
    return selectedLeagues;
  }

  @Selector()
  static getAllLeaguesForSportTypeID(state: LeagueStateModel) {
    return (id: string) => {
      const leaguesMatch: League[] = [];
      Object.values(state.entities).map(l => {
        if (l.sportTypeID === id) {
          leaguesMatch.push(l);
        }
      });
      return leaguesMatch;
    };
  }

  static getSelectedLeagueIDsForSportTypeID(id: string) {
    return createSelector([LeagueState], (state: LeagueStateModel) => {
      const selectedLeagueIDs: string[] = [];
      Object.values(state.entities).forEach(l => {
        if (l.sportTypeID === id) {
          if (l.selected) {
            selectedLeagueIDs.push(l.id);
          }
        }
      });
      return selectedLeagueIDs;
    });
  }

  static getLeaguesForSportTypeID(id: string) {
    return createSelector([LeagueState], (state: LeagueStateModel) => {
      const leagues: League[] = [];
      Object.values(state.entities).forEach(l => {
        if (l.sportTypeID === id) {
          leagues.push(l);
        }
      });
      return leagues;
    });
  }

  @Action(Leagues.AddLeagues)
  addLeagues(ctx: StateContext<LeagueStateModel>, action: Leagues.AddLeagues) {
    action.leagues.forEach(l => {
      ctx.setState(
        patch<LeagueStateModel>({
          entities: patch({ [l.id]: l }),
          IDs: append([l.id])
        })
      );
    });
  }

  @Action(Leagues.AddLeague)
  add(ctx: StateContext<LeagueStateModel>, action: Leagues.AddLeague) {
    ctx.setState(
      patch<LeagueStateModel>({
        entities: patch({ [action.newLeague.id]: action.newLeague }),
        IDs: append([action.newLeague.id])
      })
    );
  }

  @Action(Leagues.UpdateLeagues)
  update(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateLeagues) {
    const state = { ...ctx.getState(), entities: { ...ctx.getState().entities } };
    action.updatedLeagues.forEach(updatedLeague => {
      const existingLeague: League = { ...state.entities[updatedLeague.id] };
      delete state.entities[updatedLeague.id];
      const updated = updateLeague(updatedLeague, existingLeague);
      state.entities[updated.id] = updated;
    });
    ctx.setState(
      patch({
        ...state,
        entities: state.entities
      })
    );
  }

  @Action(Leagues.UpdateSelectedLeagues)
  updatedSelected(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateSelectedLeagues) {
    const state = {
      ...ctx.getState(),
      entities: { ...ctx.getState().entities }
    };

    for (let index = 0; index < Object.values(state.entities).length; index++) {
      const league: League = { ...Object.values(state.entities)[index] };
      // if the current league sport type ID matches the incoming
      if (league.sportTypeID === action.sportTypeID) {
        // if the list of selected leagues has any id matching current league id
        if (action.selected.some(selectedID => selectedID === league.id)) {
          league.selected = true;
        } else {
          league.selected = false;
        }
        state.entities[league.id] = league;
      }
    }

    ctx.setState(
      patch<LeagueStateModel>({
        entities: state.entities
      })
    );
  }

  @Action(Leagues.DeleteLeagues)
  /**
   * @param  {StateContext<LeagueStateModel>} ctx
   * @param  {Leagues.DeleteLeagues} action
   * This is another approach to deleting items. The second approach
   * to deleting items is inside the teams state and it appears to be more
   * efficient. Keeping this for reference in case something goes wrong
   * with either one
   */
  delete(ctx: StateContext<LeagueStateModel>, action: Leagues.DeleteLeagues) {
    const state = ctx.getState();
    const updatedLeagueEntities = {};
    const updatedIDs = [];
    for (let index = 0; index < Object.keys(state.entities).length; index++) {
      const keepID = Object.keys(state.entities)[index];
      // if the delete ids list does NOT contain the currently iterating id, keep it
      if (!action.deleteIDs.includes(keepID)) {
        updatedLeagueEntities[keepID] = { ...state.entities[keepID] };
        updatedIDs.push(keepID);
      }
    }
    ctx.patchState({
      ...state,
      entities: updatedLeagueEntities,
      IDs: updatedIDs
    });
  }
}
