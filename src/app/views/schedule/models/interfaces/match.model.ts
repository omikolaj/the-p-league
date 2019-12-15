import * as moment from 'moment';
import { Moment } from 'moment';
import { AwayTeam, HomeTeam } from './team.model';

// Represents a match between two teams in any league
export interface Match {
	dateTime?: Moment;
	homeTeam: HomeTeam;
	awayTeam: AwayTeam;	

	schedule(date: moment.Moment, time: moment.MomentSetObject, match: Match): void;
}
