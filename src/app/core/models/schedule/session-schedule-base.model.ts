import { Moment } from 'moment';
import { GameDay } from './game-day.model';
import { TeamSession } from './team-session.model';

/**
 * @description Represents basic information that all session
 * schedules will have (NewSessionSchedule, TeamSessionSchedule, LeagueSessionSchedule, ModifySessionSchedule)
 */
export default class SessionScheduleBase {
	id?: string;
	leagueID: string;
	leagueName?: string;
	byeWeeks: boolean;
	numberOfWeeks: number;
	sessionStart: Moment;
	sessionEnd: Moment;
	sportTypeID?: string;
	sportTypeName?: string;
	teamsSessions?: TeamSession[];
	gamesDays?: GameDay[];
}
