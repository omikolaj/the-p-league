import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { SportTypeState } from './sport-type.state';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Leagues } from '../actions/league.actions';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';

export interface LeagueModel {
  selected: League[];
  loading: boolean;
  error?: any;
}

@State<LeagueModel>({
  name: 'leagues',
  defaults: {
    selected: [],
    loading: false
  }
})
export class LeagueState {
  constructor() {}

  @Selector([LeagueState, SportTypeState])
  static getAll(leaguestate, sportTypes) {
    let allLeagues: League[] = [];
    for (let index = 0; index < sportTypes.sports.length; index++) {
      const sportType: SportType = sportTypes.sports[index];
      allLeagues = [...allLeagues, ...sportType.leagues];
    }
    return allLeagues;
  }

  @Selector()
  static getSelected(state: LeagueModel) {
    console.log('returning all selected leagues', state);
    return state.selected;
  }

  @Action(Leagues.UpdateSelectedLeagues)
  updatedSelected(ctx: StateContext<LeagueModel>, action: Leagues.UpdateSelectedLeagues) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      selected: [...action.selected]
    });
  }
}
