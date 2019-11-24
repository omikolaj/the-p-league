import { League } from '../../views/schedule/models/interfaces/league.model';

export namespace Leagues {
  export class InitializeLeagues {
    static readonly type = '[Schedule] InitializeLeagues';
    constructor(public leagues: { [key: string]: League }) {}
  }
  export class AddLeague {
    static readonly type = '[Schedule API] AddLeague';
    constructor(public newLeague: League) {}
  }
  export class AddTeamIDsToLeague {
    static readonly type = '[Schedule] AddTeamIDsToLeague';
    constructor(public payload: { leagueID: string; ids?: string[] }[]) {}
  }
  export class UpdateLeagues {
    static readonly type = '[Schedule API] UpdateLeagues';
    constructor(public updatedLeagues: League[]) {}
  }
  export class UpdateSelectedLeagues {
    static readonly type = '[Schedule] UpdateSelectedLeagues';
    constructor(public selected: string[], public effected: string[]) {}
  }
  export class DeleteLeagues {
    static readonly type = '[Schedule] DeleteLeagues';
    constructor(public deleteIDs: string[]) {}
  }
  export class DeleteTeamIDsFromLeague {
    static readonly type = '[Schedule] DeleteTeamIDsFromLeague';
    constructor(public leagueID: string, public deleteIDs: string[]) {}
  }
}
