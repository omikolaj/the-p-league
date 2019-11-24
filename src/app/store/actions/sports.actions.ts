import { Team } from '../../views/schedule/models/interfaces/team.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

export namespace Sports {
  export class AddSportType {
    static readonly type = '[Schedule API] AddSportType';
    constructor(public newSportType: SportType) {}
  }

  export class AddSportTypeLeagueID {
    static readonly type = '[Schedule] AddSportTypeLeagueID';
    constructor(public sportTypeID: string, public leagueID: string) {}
  }

  export class AddSportTypeSuccess {
    static readonly type = '[Schedule API] AddSportTypeSuccess';
  }

  export class AddSportTypeFailed {
    static readonly type = '[Schedule API] AddSportTypeFailed';
    constructor(public error: any) {}
  }

  export class UpdateSportType {
    static readonly type = '[Schedule API] UpdateSportType';
    constructor(public updatedSportType: SportType) {}
  }

  export class UpdateSportTypeSuccess {
    static readonly type = '[Schedule API] UpdateSportTypeSuccess';
  }

  export class UpdateSportTypeFailed {
    static readonly type = '[Schedule API] UpdateSportTypeFailed';
    constructor(public error: SportType) {}
  }

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

  export class DeleteSportType {
    static readonly type = '[Schedule API] DeleteSportType';
    constructor(public id: string) {}
  }

  export class DeleteSportTypeSuccess {
    static readonly type = '[Schedule API] DeleteSportTypeSuccess';
  }

  export class DeleteSportTypeFailed {
    static readonly type = '[Schedule API] DeleteSportTypeFailed';
    constructor(public error: any) {}
  }

  export class DeleteSportTypeLeagueIDs {
    static readonly type = '[Schedule API] DeleteSportTypeLeagueIDs';
    constructor(public sportTypeID: string, public deleteIDs: string[]) {}
  }

  export class UpdateSelectedLeaguesForSportType {
    static readonly type = '[Schedule] UpdateSelectedLeaguesForSportType';
    constructor(public selectedLeagues: League[]) {}
  }

  //#endregion
}
