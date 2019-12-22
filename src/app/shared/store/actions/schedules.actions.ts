import Match from 'src/app/core/models/schedule/classes/match.model';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';

export class CreateSchedules {
	static readonly type = '[Schedule] CreateSchedules';
	constructor(public newSessions: LeagueSessionSchedule[]) {}
}

export class GetSchedules {
	static readonly type = '[Schedule] GetSchedules';
	constructor() {}
}

// TODO consider removing this if not used
export class DeleteMatch {
	static readonly type = '[Schedule] DeleteMatch';
	constructor(public match: Match) {}
}
