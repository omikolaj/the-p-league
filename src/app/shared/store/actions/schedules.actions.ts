import { ActiveSessionInfo } from 'src/app/core/models/schedule/active-session-info.model';
import LeagueSessionScheduleDTO from 'src/app/core/models/schedule/classes/league-session-schedule-DTO.model';
import LeagueSessionSchedule from 'src/app/core/models/schedule/classes/league-session-schedule.model';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { MatchResult } from 'src/app/core/models/schedule/match-result.model';

export class InitializeSessions {
	static readonly type = '[Schedule] InitializeSessions';
	constructor(public sessions: { [key: string]: LeagueSessionSchedule }) {}
}
export class InitializeActiveSessionsInfo {
	static readonly type = '[Schedule] InitializeActiveSessionsInfo';
	constructor(public activeSessions: ActiveSessionInfo[]) {}
}

export class InitializeMatches {
	static readonly type = '[Schedule] InitializeMatches';
	constructor(public matches: { [key: string]: Match }) {}
}

export class GeneratePreviewSchedules {
	static readonly type = '[Schedule] GeneratePreviewSchedules';
	constructor(public newSessions: LeagueSessionScheduleDTO[]) {}
}

export class ClearPreviewSchedules {
	static readonly type = '[Schedule] ClearPreviewSchedules';
	constructor() {}
}

export class UpdateMatchResult {
	static readonly type = '[Schedule] UpdateMatchResult';
	constructor(public matchResult: MatchResult) {}
}
