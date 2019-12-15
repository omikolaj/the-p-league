import { Moment } from 'moment';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { GameDay } from './game-day.model';

/**
 * @description Represents basic information that all session
 * schedules will have (NewSessionSchedule, TeamSessionSchedule, LeagueSessionSchedule, ModifySessionSchedule)
 */
export default class  SessionScheduleBase {
	id?: string;
	leagueID: string; 
	byeWeeks: boolean;
	numberOfWeeks: number;
	sessionStart: Moment;
	sessionEnd: Moment;
	teams?: Team[];
	gamesDays?: GameDay[];
}
