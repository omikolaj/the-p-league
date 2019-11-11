import { Leagues } from 'src/app/store/actions/league.actions';
import { cloneDeep } from 'lodash';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { SportTypeState, SportTypeStateModel } from './sport-type.state';
import { State, Selector, Action, StateContext, createSelector, Store, StateOperator } from '@ngxs/store';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { patch, updateItem, append } from '@ngxs/store/operators';

export interface LeagueStateModel {
  entities: {
    [id: string]: any;
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
  static getAll(leaguestate, sportTypesState) {
    let allLeagues: League[] = [];
    for (let index = 0; index < sportTypesState.length; index++) {
      const sportType: SportType = sportTypesState[index];
      allLeagues = [...allLeagues, ...sportType.leagues];
    }
    return allLeagues;
  }

  @Selector()
  static getSelected(state: LeagueStateModel) {
    return state.selected;
  }

  @Selector()
  static getAllLeaguesForSportTypeID(state: LeagueStateModel) {
    return (id: string) => {
      const leagues: League[] = [];
      const leagueObjects = Object.values(state.entities);
      leagueObjects.map((l: League) => {
        if (l.sportTypeID === id) {
          leagues.push(l);
        }
      });
      console.log('logging get all leagues for sport id', leagues);
      return leagues;
    };
  }

  @Action(Leagues.GetAllLeagues)
  getAll(ctx: StateContext<LeagueStateModel>) {
    const action = this.store.selectSnapshot(LeagueState.getAll);
    const state = ctx.getState();
    let allLeagues = {};
    action.forEach(l => {
      allLeagues[l.id] = l;
    });
    ctx.setState({
      entities: allLeagues,
      IDs: action.map(l => l.id),
      selected: [...state.selected]
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
    console.log('league add state', ctx.getState());
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
    console.log('leagues state update', ctx.getState());
  }

  @Action(Leagues.DeleteLeagues)
  delete(ctx: StateContext<LeagueStateModel>, action: Leagues.DeleteLeagues) {
    const state = ctx.getState();
    const updatedLeagueEntities = {};
    const updatedIDs = [];
    action.deleteIDs.forEach(deleteID => {
      Object.keys(state.entities).map(i => {
        if (i !== deleteID) {
          updatedLeagueEntities[i] = state.entities[i];
          updatedIDs.push(i);
        }
      });
    });
    ctx.patchState({
      ...state,
      entities: cloneDeep(updatedLeagueEntities),
      IDs: updatedIDs
    });
  }

  @Action(Leagues.UpdateSelectedLeagues)
  updatedSelected(ctx: StateContext<LeagueStateModel>, action: Leagues.UpdateSelectedLeagues) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      selected: [...action.selected]
    });
  }
}
