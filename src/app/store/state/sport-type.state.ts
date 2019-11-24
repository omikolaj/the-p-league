import { Teams } from 'src/app/store/actions/teams.actions';
import { SportTypeStateModel } from 'src/app/store/state/sport-type.state';
import { Leagues } from 'src/app/store/actions/leagues.actions';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { State, Selector, StateContext, Action, createSelector } from '@ngxs/store';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { patch, append } from '@ngxs/store/operators';
import { LeagueState, LeagueStateModel } from './league.state';
import { SportTypesLeaguesPairs } from 'src/app/views/admin/schedule/models/sport-types-leagues-pairs.model';
import { sportListSchema } from './schema';
import { normalize } from 'normalizr';
import produce, { original } from 'immer';
import { updateEntity } from './state-helpers';
import { Sports } from '../actions/sports.actions';

export interface SportTypeStateModel {
  entities: {
    [id: string]: SportType;
  };
  IDs: string[];
  loading: boolean;
  error?: any | null;
}

@State<SportTypeStateModel>({
  name: 'types',
  defaults: {
    entities: {},
    IDs: [],
    loading: false
  }
})
export class SportTypeState {
  constructor(private scheduleAdminAsyncService: ScheduleAdministrationAsyncService) {}

  @Selector()
  static getSportTypes(state: SportTypeStateModel) {
    return Object.values(state.entities);
  }

  static getSportTypeByID(id: string) {
    return createSelector([SportTypeState], (state: SportTypeStateModel) => {
      const sportTypeEntityID = Object.keys(state.entities).find(entityID => entityID === id);
      if (sportTypeEntityID) {
        return state.entities[sportTypeEntityID];
      }
    });
  }

  @Selector([SportTypeState, LeagueState])
  static getSportTypesLeaguesPairs(state: SportTypeStateModel, leagueState: LeagueStateModel) {
    const pairs: SportTypesLeaguesPairs[] = [];
    Object.values(state.entities).forEach(s => {
      pairs.push({
        sportID: s.id,
        sportName: s.name,
        leagueNames: []
      });
    });

    Object.values(leagueState.entities).forEach(l => {
      pairs.forEach(pair => {
        if (pair.sportID === l.sportTypeID) {
          pair.leagueNames.push({
            id: l.id,
            name: l.name
          });
        }
      });
    });
    return pairs;
  }

  //#region FetchAll

  @Action(Sports.FetchAllSportTypes)
  fetchAll(ctx: StateContext<SportTypeStateModel>) {
    return this.scheduleAdminAsyncService.fetchAllSportTypes().pipe(
      map(fetchedSportTypes => normalize(fetchedSportTypes, sportListSchema)),
      tap(normalizedData => {
        ctx.setState(
          patch<SportTypeStateModel>({
            entities: normalizedData.entities['sports'],
            IDs: normalizedData.result,
            loading: true
          })
        );
      }),
      tap(normalizedData => ctx.dispatch(new Leagues.InitializeLeagues(normalizedData.entities['leagues']))),
      tap(normalizedData => ctx.dispatch(new Teams.InitializeTeams(normalizedData.entities['teams']))),
      switchMap(() => ctx.dispatch(new Sports.FetchAllSportTypesSuccess())),
      catchError(err => ctx.dispatch(new Sports.FetchAllSportTypesFailed(err)))
    );
  }

  @Action(Sports.FetchAllSportTypesSuccess)
  fetchSuccess(ctx: StateContext<SportTypeStateModel>) {
    console.log('Inside of fetchAllSportTypesSuccess action');
    ctx.patchState({
      loading: false,
      error: null
    });
  }

  @Action(Sports.FetchAllSportTypesFailed)
  fetchFailed(ctx: StateContext<SportTypeStateModel>, action: Sports.FetchAllSportTypesFailed) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  //#endregion

  //#region Add

  @Action(Sports.AddSportType)
  add(ctx: StateContext<SportTypeStateModel>, action: Sports.AddSportType) {
    ctx.setState(
      produce((draft: SportTypeStateModel) => {
        draft.entities[action.newSportType.id] = action.newSportType;
        // initialize the leagues array if it is not already initialized
        draft.entities[action.newSportType.id].leagues = draft.entities[action.newSportType.id].leagues || [];
        draft.IDs.push(action.newSportType.id);
      })
    );
  }

  @Action(Sports.AddSportTypeSuccess)
  addSuccess() {}

  @Action(Sports.AddSportTypeFailed)
  addFailed() {}

  @Action(Sports.AddSportTypeLeagueID)
  addLeagueID(ctx: StateContext<SportTypeStateModel>, action: Sports.AddSportTypeLeagueID) {
    ctx.setState(
      produce((draft: SportTypeStateModel) => {
        // in case we have not initialized the leagues array, initialize it than add the league id
        draft.entities[action.sportTypeID].leagues = (draft.entities[action.sportTypeID].leagues || []).concat([action.leagueID]);
      })
    );
  }

  //#endregion

  //#region Update
  @Action(Sports.UpdateSportType)
  update(ctx: StateContext<SportTypeStateModel>, action: Sports.UpdateSportType) {
    ctx.setState(
      produce((draft: SportTypeStateModel) => {
        draft.entities[action.updatedSportType.id] = updateEntity(action.updatedSportType, draft.entities[action.updatedSportType.id]);
      })
    );
  }

  @Action(Sports.UpdateSportTypeSuccess)
  updateSuccess() {}

  @Action(Sports.UpdateSportTypeFailed)
  updateFailed() {}
  //#endregion

  //#region Delete
  @Action(Sports.DeleteSportType)
  delete(ctx: StateContext<SportTypeStateModel>, action: Sports.DeleteSportType) {
    ctx.setState(
      produce(draft => {
        delete draft.entities[action.id];
        draft.IDs = draft.IDs.filter(id => id !== action.id);
      })
    );
  }

  @Action(Sports.DeleteSportTypeSuccess)
  deleteSuccess() {}

  @Action(Sports.DeleteSportTypeFailed)
  deleteFailed() {}

  @Action(Sports.DeleteSportTypeLeagueIDs)
  addSportTypeID(ctx: StateContext<SportTypeStateModel>, action: Sports.DeleteSportTypeLeagueIDs) {
    ctx.setState(
      produce((draft: SportTypeStateModel) => {
        action.deleteIDs.forEach(deleteID => {
          const index = draft.entities[action.sportTypeID].leagues.indexOf(deleteID);
          if (index !== -1) {
            draft.entities[action.sportTypeID].leagues.splice(index, 1);
          }
        });
      })
    );
  }

  //#endregion
}
