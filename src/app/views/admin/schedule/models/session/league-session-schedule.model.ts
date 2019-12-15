import Match from 'src/app/views/schedule/models/classes/match.model';
import SessionScheduleBase from './session-schedule-base.model';

/**
 * @description Represents a session schedule for a given league
 */
export default class LeagueSessionSchedule extends SessionScheduleBase {
	matches?: Match[] = [];
	active?: boolean;

	constructor() {
		super();
	}
}
