import SessionScheduleBase from '../session-schedule-base.model';
import Match from './match.model';

/**
 * @description Represents a session schedule for a given league
 */
// export default class LeagueSessionScheduleDTO extends SessionScheduleBaseDTO {
// 	matches?: MatchDTO[] = [];
// 	active?: boolean;

// 	constructor() {
// 		super();
// 	}
// }

export default class LeagueSessionScheduleDTO extends SessionScheduleBase {
	matches?: Match[] = [];
	active?: boolean;

	constructor() {
		super();
	}
}
