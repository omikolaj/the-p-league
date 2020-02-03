import { Team } from 'src/app/core/models/schedule/team.model';

export class InitializeTeams {
	static readonly type = '[Schedule] InitializeTeams';
	constructor(public teams: { [key: string]: Team }) {}
}
export class AddTeam {
	static readonly type = '[Schedule API] AddTeam';
	constructor(public newTeam: Team) {}
}
export class AddUnassignedTeams {
	static readonly type = '[Schedule] AddTeams';
	constructor(public teams: Team[]) {}
}
export class UpdateTeams {
	static readonly type = '[Schedule API] UpdateTeams';
	constructor(public updatedTeams: Team[]) {}
}
export class UpdateSelectedTeams {
	static readonly type = '[Schedule] UpdateSelectedTeams';
	constructor(public selected: string[], public leagueID: string) {}
}
export class AssignTeams {
	static readonly type = '[Schedule API] AssignTeams';
	constructor(public assignTeams: Team[]) {}
}
export class UnassignTeams {
	static readonly type = '[Schedule API] UnassignTeams';
	constructor(public unassignIDs: string[]) {}
}
export class DeleteTeams {
	static readonly type = '[Schedule API] DeleteTeams';
	constructor(public deleteIDs: string[]) {}
}
