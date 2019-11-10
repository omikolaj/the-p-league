import { tap, catchError, switchMap } from 'rxjs/operators';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { State, Selector, StateContext, Action, createSelector } from '@ngxs/store';
import { Schedule } from '../actions/schedule.actions';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { Leagues } from '../actions/league.actions';
import { patch, updateItem, append, removeItem } from '@ngxs/store/operators';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
export interface SportTypeStateModel {
  sports: SportType[];
  loading: boolean;
  error?: any | null;
}

@State<SportTypeStateModel>({
  name: 'types',
  defaults: {
    sports: [],
    loading: false
  }
})
export class SportTypeState {
  constructor(private scheduleAdminAsyncService: ScheduleAdministrationAsyncService) {}

  @Selector()
  static getSportTypes(state) {
    return state.sports;
  }

  @Selector()
  static getSportTypeByID(id: string) {
    return createSelector(
      [SportTypeState],
      state => {
        const sportType = state.types.sports.find(s => s.id === id);
        if (sportType) {
          return sportType;
        }
      }
    );
  }

  //#region FetchAll

  @Action(Schedule.FetchAllSportTypes)
  fetchAll(ctx: StateContext<SportTypeStateModel>) {
    return this.scheduleAdminAsyncService.fetchAllSportTypes().pipe(
      tap(fetchedSportTypes => {
        ctx.setState({
          sports: fetchedSportTypes,
          loading: true
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
    return this.scheduleAdminAsyncService.addSport(action.newSportType).pipe(
      tap(newSport => {
        const state = ctx.getState();
        ctx.patchState({
          sports: [...state.sports, newSport],
          loading: true
        });
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
    const state = ctx.getState();
    ctx.setState(
      patch({
        ...state,
        sports: updateItem(s => s.id === action.updatedSportType.id, action.updatedSportType)
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
    ctx.setState(
      patch({
        ...state,
        sports: removeItem<SportType>(s => s.id === action.id)
      })
    );
  }

  @Action(Schedule.DeleteSportTypeSuccess)
  deleteSuccess() {}

  @Action(Schedule.DeleteSportTypeFailed)
  deleteFailed() {}
  //#endregion

  @Action(Schedule.AddLeague)
  addLeagueToSportType(ctx: StateContext<SportTypeStateModel>, action: Schedule.AddLeague) {
    const state = ctx.getState();
    ctx.setState(
      patch({
        ...state,
        sports: updateItem(
          s => s.id === action.newLeague.sportTypeID,
          patch<SportType>({
            leagues: append([action.newLeague])
          })
        )
      })
    );
  }
}
