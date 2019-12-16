import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';

export class CreateSchedules {
	static readonly type = '[Schedule] CreateSchedules';
	constructor(public newSessions: LeagueSessionSchedule[]) {}
}

export class GetSchedules {
	static readonly type = '[Schedule] GetSchedules';
	constructor() {}
}
