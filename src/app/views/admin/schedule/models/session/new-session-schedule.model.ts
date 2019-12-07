import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { GameDay } from './game-day.model';
import SessionScheduleBase from './session-schedule-base.model';

/**
 * @description Represents new session for a given league
 * which contains information that describes the new session
 */
export default class NewSessionSchedule extends SessionScheduleBase {
	teams?: Team[];
	gamesDays?: GameDay[];
}
