import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from '../../views/schedule/models/interfaces/league.model';
import { SportTypeStateModel } from '../state/sport-type.state';
import { NormalizedSchema } from 'normalizr';

export namespace Leagues {
  // export class AddLeagues {
  //   static readonly type = '[Schedule] AddLeagues';
  //   constructor(public leagues: League[]) {}
  // }
  export class InitializeLeagues {
    static readonly type = '[Schedule] InitializeLeagues';
    constructor(public leagues: { [key: string]: League }) {}
  }
  export class AddLeague {
    static readonly type = '[Schedule API] AddLeague';
    constructor(public newLeague: League) {}
  }
  export class AddLeagueSuccess {
    static readonly type = '[Schedule API] AddLeagueSuccess';
  }
  export class AddLeagueFailed {
    static readonly type = '[Schedule API] AddLeagueFailed';
    constructor(public error: any) {}
  }
  export class UpdateLeagues {
    static readonly type = '[Schedule API] UpdateLeagues';
    constructor(public updatedLeagues: League[]) {}
  }
  export class UpdateLeaguesSuccess {
    static readonly type = '[Schedule API] UpdateLeaguesSuccess';
  }
  export class UpdateLeaguesFailed {
    static readonly type = '[Schedule API] UpdateLeaguesFailed';
    constructor(public error: any) {}
  }
  export class DeleteLeagues {
    static readonly type = '[Schedule] DeleteLeagues';
    constructor(public deleteIDs: string[]) {}
  }
  export class DeleteSelectedLeagues {
    static readonly type = '[Schedule] DeleteSelectedLeagues';
    constructor(public deleteIDs: string[]) {}
  }
  export class UpdateSelectedLeagues {
    static readonly type = '[Schedule] UpdateSelectedLeagues';
    constructor(public selected: string[], public sportTypeID: string) {}
  }
}
