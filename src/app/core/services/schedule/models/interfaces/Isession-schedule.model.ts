import * as moment from 'moment';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { TimesOfDay } from 'src/app/views/schedule/models/interfaces/times-of-day.model';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
import { League } from '../../../../../views/schedule/models/interfaces/League.model';

export interface ISessionSchedule {
	league: League;
	startDate: moment.Moment;
	endDate: moment.Moment;
	teams: Team[];
	desiredDays: MatchDay[];
	timesOfDays: TimesOfDay[];
	sessionMatches: Match[];
}
