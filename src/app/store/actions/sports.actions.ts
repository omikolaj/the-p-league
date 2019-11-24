import { Team } from '../../views/schedule/models/interfaces/team.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

export namespace Sports {
  export class FetchAllSportTypes {
    static readonly type = '[Schedule API] FetchAllSportTypes';
  }
  export class FetchAllSportTypesSuccess {
    static readonly type = '[Schedule API] FetchAllSportTypesSuccess';
  }
  export class FetchAllSportTypesFailed {
    static readonly type = '[Schedule API] FetchALlSportTypesFailed';
    constructor(public error: any) {}
  }
  export class AddSportType {
    static readonly type = '[Schedule API] AddSportType';
    constructor(public newSportType: SportType) {}
  }
  export class AddLeagueIDsToSportType {
    static readonly type = '[Schedule] AddLeagueIDsToSportType';
    constructor(public payload: { sportTypeID: string; ids: string[] }[]) {}
  }
  export class UpdateSportType {
    static readonly type = '[Schedule API] UpdateSportType';
    constructor(public updatedSportType: SportType) {}
  }
  export class UpdateSelectedLeaguesForSportType {
    static readonly type = '[Schedule] UpdateSelectedLeaguesForSportType';
    constructor(public selectedLeagues: League[]) {}
  }
  export class DeleteSportType {
    static readonly type = '[Schedule API] DeleteSportType';
    constructor(public id: string) {}
  }
  export class DeleteLeagueIDsFromSportType {
    static readonly type = '[Schedule API] DeleteLeagueIDsFromSportType';
    constructor(public sportTypeID: string, public deleteIDs: string[]) {}
  }
}
