import SessionScheduleBase from '../session-schedule-base.model';
import Match from './match.model';

export default class LeagueSessionScheduleDTO extends SessionScheduleBase {
	matches?: Match[] = [];
	active?: boolean;

	constructor() {
		super();
	}
}
