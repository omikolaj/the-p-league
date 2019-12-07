import { Match } from 'src/app/views/schedule/models/interfaces/match.model';
import NewSessionSchedule from './new-session-schedule.model';
import SessionScheduleBase from './session-schedule-base.model';

/**
 * @description Represents an existing session schedule for a given league
 */
export default class LeagueSessionSchedule extends SessionScheduleBase {
	matches: Match[] = [];
	active: boolean;

	constructor(sessionInfo?: Partial<NewSessionSchedule>) {
		super();
		Object.assign(this, sessionInfo);
	}
}
