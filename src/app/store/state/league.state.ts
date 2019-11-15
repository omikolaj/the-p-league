import { Leagues } from 'src/app/store/actions/league.actions';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { SportTypeState } from './sport-type.state';
import { State, Selector, Action, StateContext, Store, createSelector } from '@ngxs/store';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { patch, append } from '@ngxs/store/operators';

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
  constructor(private store: Store) {}

  @Selector([LeagueState, SportTypeState.getSportTypes])
  static getAll(sportTypesState) {
    let allLeagues: League[] = [];
    for (let index = 0; index < sportTypesState.length; index++) {
      const sportType: SportType = sportTypesState[index];
      allLeagues = [...allLeagues, ...sportType.leagues];
    }
    return allLeagues;
  }

  @Selector()
  static getSelected(state: LeagueStateModel) {
    return Object.values(state.entities).map(l => {
      if (l.selected) {
        return l;
      }
    });
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

  static getSelectedForSportTypeID(id: string) {
    return createSelector([LeagueState], (state: LeagueStateModel) => {
      const leagueIDsToDelete: string[] = [];
      Object.values(state.entities).forEach(l => {
        if (l.sportTypeID === id) {
          if (l.selected) {
            leagueIDsToDelete.push(l.id);
          }
        }
      });
      return leagueIDsToDelete;
    });
  }

  @Action(Leagues.FetchLeagues)
  fetchAll(ctx: StateContext<LeagueStateModel>, action: Leagues.FetchLeagues) {
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
    action.updatedLeagues.forEach(updatedLeague => {
      ctx.setState(
        patch<LeagueStateModel>({
          entities: patch({
            [updatedLeague.id]: updatedLeague
          })
        })
      );
    });
  }

  @Action(Leagues.DeleteLeagues)
  delete(ctx: StateContext<LeagueStateModel>, action: Leagues.DeleteLeagues) {
    const state = ctx.getState();
    const updatedLeagueEntities = {};
    const updatedIDs = [];
    for (let index = 0; index < Object.keys(state.entities).length; index++) {
      const keepID = Object.keys(state.entities)[index];
      // if the delete ids list does NOT contain the currently iterating id, keep it
      if (!action.deleteIDs.includes(keepID)) {
        updatedLeagueEntities[keepID] = state.entities[keepID];
      }
    }
    ctx.patchState({
      ...state,
      entities: updatedLeagueEntities,
      IDs: updatedIDs
    });
  }

  @Action(Leagues.UpdateSelectedLeagues)
  updatedSelected(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateSelectedLeagues) {
    const state = {
      ...ctx.getState(),
      entities: { ...ctx.getState().entities }
    };
    for (let index = 0; index < Object.values(ctx.getState().entities).length; index++) {
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
}
