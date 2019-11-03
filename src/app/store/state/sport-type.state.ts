import { log } from 'util';
import { tap, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { State, Selector, StateContext, Action } from '@ngxs/store';
import { Schedule } from '../actions/schedule.actions';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';

export interface SportTypeModel {
  sportTypes: SportType[];
  loading: boolean;
  error?: any;
}

@State<SportTypeModel>({
  name: 'sportTypes',
  defaults: {
    sportTypes: [],
    loading: false
  }
})
export class SportTypeState {
  constructor(private scheduleAdminAsyncService: ScheduleAdministrationAsyncService) {}

  @Selector()
  static getSportTypes(state: SportTypeModel) {
    return state.sportTypes;
  }

  @Action(Schedule.FetchAllSportTypes)
  fetchAll(ctx: StateContext<SportTypeModel>) {
    return this.scheduleAdminAsyncService.fetchAllSportTypes().pipe(
      tap(fetchedSportTypes => {
        ctx.setState({
          sportTypes: fetchedSportTypes,
          loading: true
        });
      }),
      switchMap(() => ctx.dispatch(new Schedule.FetchAllSportTypesSuccess())),
      catchError(err => ctx.dispatch(new Schedule.FetchAllSportTypesFailed(err)))
    );
  }

  @Action(Schedule.FetchAllSportTypesSuccess)
  fetchSuccess(ctx: StateContext<SportTypeModel>) {
    console.log('Inside of fetchAllSportTypesSuccess action');
    ctx.patchState({
      loading: false
    });
  }

  @Action(Schedule.FetchAllSportTypesFailed)
  fetchFailed(ctx: StateContext<SportTypeModel>, action: Schedule.FetchAllSportTypesFailed) {
    const state = ctx.getState();
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }
}
