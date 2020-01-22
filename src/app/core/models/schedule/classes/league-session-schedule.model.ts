import SessionScheduleBase from '../session-schedule-base.model';

/**
 * @description Represents a session schedule for a given league
 */
export default class LeagueSessionSchedule extends SessionScheduleBase {
	matches?: string[] = [];
	active?: boolean;

	constructor() {
		super();
	}
}
