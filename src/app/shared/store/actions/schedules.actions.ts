import { ActiveSessionInfo } from 'src/app/core/models/schedule/active-session-info.model';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';

export class FetchLeaguesSessionSchedules {
	static readonly type = '[Schedule API] FetchLeaguesSessionSchedules';
	constructor() {}
}

export class FetchLeaguesSessionSchedulesSuccess {
	static readonly type = '[Schedule API] FetchLeaguesSessionSchedulesSuccess';
	constructor() {}
}

export class FetchLeaguesSesssionSchedulesFailed {
	static readonly type = '[Schedule API] FetchLeaguesSessionSchedulesFailed';
	constructor(private error: any) {}
}

export class InitializeActiveSessionsInfo {
	static readonly type = '[Schedule] InitializeActiveSessionsInfo';
	constructor(public activeSessions: ActiveSessionInfo[]) {}
}

export class CreateSchedules {
	static readonly type = '[Schedule] CreateSchedules';
	constructor(public newSessions: LeagueSessionSchedule[]) {}
}

export class GetSchedules {
	static readonly type = '[Schedule] GetSchedules';
	constructor() {}
}

export class InitializeLeagueSessionSchedules {
	static readonly type = '[Schedule API] FetchLeagueSessionSchdules';
	constructor(public payload: LeagueSessionSchedule[]) {}
}
