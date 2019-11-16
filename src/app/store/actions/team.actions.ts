import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from '../../views/schedule/models/interfaces/league.model';
import { SelectedLeagues } from 'src/app/views/admin/schedule/models/selected-leagues.model';

export namespace Teams {
  export class AddTeams {
    static readonly type = '[Schedule] AddTeams';
    constructor(public teams: Team[]) {}
  }
  export class AddTeam {
    static readonly type = '[Schedule API] AddTeam';
    constructor(public newTeam: Team) {}
  }

  export class UpdateTeams {
    static readonly type = '[Schedule API] UpdateTeams';
    constructor(public updatedTeams: Team[]) {}
  }

  export class UnassignTeams {
    static readonly type = '[Schedule API] UnassignTeams';
    constructor(public unassignIDs: string[]) {}
  }

  export class DeleteTeams {
    static readonly type = '[Schedule API] DeleteTeams';
    constructor(public deleteIDs: string[]) {}
  }

  export class UpdateSelectedTeams {
    static readonly type = '[Schedule] UpdateSelectedTeams';
    constructor(public selected: string[], public leagueID: string) {}
  }
}
