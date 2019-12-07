import { Moment } from 'moment';

/**
 * @description Represents basic information that all session
 * schedules will have (NewSessionSchedule, TeamSessionSchedule, LeagueSessionSchedule, ModifySessionSchedule)
 */
export default class SessionScheduleBase {
	id?: string;
	leagueID: string;
	byeWeeks: boolean;
	numberOfWeeks: number;
	sessionStart: Moment;
	sessionEnd: Moment;
}
