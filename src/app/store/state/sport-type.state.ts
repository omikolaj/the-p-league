import { cloneDeep } from 'lodash';
import { SportTypeStateModel } from 'src/app/store/state/sport-type.state';
import { Leagues } from 'src/app/store/actions/league.actions';
import { tap, catchError, switchMap, filter } from 'rxjs/operators';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { State, Selector, StateContext, Action, createSelector } from '@ngxs/store';
import { Schedule } from '../actions/schedule.actions';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { patch, updateItem, append, removeItem, insertItem } from '@ngxs/store/operators';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { Teams } from '../actions/team.actions';
import { LeagueState, LeagueStateModel } from './league.state';
import { SportTypesLeaguesPairs, LeagueNameIDPair } from 'src/app/views/admin/schedule/models/sport-types-leagues-pairs.model';

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

  @Selector()
  static getSportTypeByID(id: string) {
    return createSelector([SportTypeState.getSportTypes], state => {
      const sportTypeEntityID = Object.keys(state.types.entities).find(entityID => entityID === id);
      if (sportTypeEntityID) {
        return state.types.entities[sportTypeEntityID];
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

  @Action(Schedule.FetchAllSportTypes)
  fetchAll(ctx: StateContext<SportTypeStateModel>) {
    return this.scheduleAdminAsyncService.fetchAllSportTypes().pipe(
      tap(fetchedSportTypes => {
        let fetchedSports: {} = {};
        fetchedSportTypes.forEach(s => {
          fetchedSports[s.id] = s;
        });
        ctx.setState({
          entities: fetchedSports,
          IDs: fetchedSportTypes.map(s => s.id),
          loading: true
        });
        return fetchedSportTypes;
      }),
      tap(sportTypes => {
        sportTypes.map(s => {
          ctx.dispatch(new Leagues.AddLeagues(s.leagues));
        });
        return sportTypes;
      }),
      tap(sportTypes => {
        sportTypes.map(s => {
          s.leagues.map(l => ctx.dispatch(new Teams.AddTeams(l.teams)));
        });
      }),
      switchMap(() => ctx.dispatch(new Schedule.FetchAllSportTypesSuccess())),
      catchError(err => ctx.dispatch(new Schedule.FetchAllSportTypesFailed(err)))
    );
  }

  @Action(Schedule.FetchAllSportTypesSuccess)
  fetchSuccess(ctx: StateContext<SportTypeStateModel>) {
    console.log('Inside of fetchAllSportTypesSuccess action');
    ctx.patchState({
      loading: false,
      error: null
    });
  }

  @Action(Schedule.FetchAllSportTypesFailed)
  fetchFailed(ctx: StateContext<SportTypeStateModel>, action: Schedule.FetchAllSportTypesFailed) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  //#endregion

  //#region Add

  @Action(Schedule.AddSportType)
  add(ctx: StateContext<SportTypeStateModel>, action: Schedule.AddSportType) {
    console.log('Adding sporttype');
    ctx.setState(
      patch<SportTypeStateModel>({
        entities: patch({ [action.newSportType.id]: action.newSportType }),
        IDs: append([action.newSportType.id])
      })
    );
  }

  @Action(Schedule.AddSportTypeSuccess)
  addSuccess() {}

  @Action(Schedule.AddSportTypeFailed)
  addFailed() {}

  //#endregion

  //#region Update
  @Action(Schedule.UpdateSportType)
  update(ctx: StateContext<SportTypeStateModel>, action: Schedule.UpdateSportType) {
    ctx.setState(
      patch<SportTypeStateModel>({
        entities: patch({ [action.updatedSportType.id]: action.updatedSportType })
      })
    );
  }

  @Action(Schedule.UpdateSportTypeSuccess)
  updateSuccess() {}

  @Action(Schedule.UpdateSportTypeFailed)
  updateFailed() {}
  //#endregion

  //#region Delete
  @Action(Schedule.DeleteSportType)
  delete(ctx: StateContext<SportTypeStateModel>, action: Schedule.DeleteSportType) {
    const state = ctx.getState();
    const updatedSportEntities = {};
    Object.keys(state.entities).map(i => {
      if (i !== action.id) {
        updatedSportEntities[i] = state.entities[i];
      }
    });

    ctx.setState(
      patch<SportTypeStateModel>({
        entities: cloneDeep(updatedSportEntities),
        IDs: state.IDs.filter(id => id !== action.id)
      })
    );
  }

  @Action(Schedule.DeleteSportTypeSuccess)
  deleteSuccess() {}

  @Action(Schedule.DeleteSportTypeFailed)
  deleteFailed() {}
  //#endregion
}
