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
  export class AddLeagueTeamID {
    static readonly type = '[Schedule] AddLeagueTeamID';
    constructor(public leagueID: string, public addID: string) {}
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
  export class UpdateSelectedLeagues {
    static readonly type = '[Schedule] UpdateSelectedLeagues';
    constructor(public selected: string[], public effected: string[]) {}
  }
  export class DeleteLeagues {
    static readonly type = '[Schedule] DeleteLeagues';
    constructor(public deleteIDs: string[]) {}
  }
  export class DeleteSelectedLeagues {
    static readonly type = '[Schedule] DeleteSelectedLeagues';
    constructor(public deleteIDs: string[]) {}
  }
  export class DeleteLeagueTeamIDs {
    static readonly type = '[Schedule] DeleteLeagueTeamIDs';
    constructor(public leagueID: string, public deleteIDs: string[]) {}
  }
}
