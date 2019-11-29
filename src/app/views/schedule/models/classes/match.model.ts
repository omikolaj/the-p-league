import * as moment from 'moment';
import { MomentSetObject } from 'moment';
import { SessionScheduleService } from 'src/app/core/services/schedule/session-schedule/session-schedule.service';
import { AwayTeam, HomeTeam } from '../interfaces/team.model';

const TBA = 'TBA';

// Represents two teams facing each other
export default class Match implements Match {
	dateTime?: moment.Moment;
	homeTeam: HomeTeam;
	awayTeam: AwayTeam;

	constructor(private sessionSchedule: SessionScheduleService, home: HomeTeam, away: AwayTeam) {
		this.homeTeam = home;
		this.awayTeam = away;
	}

	schedule(date: moment.Moment, time: MomentSetObject, match: Match): void {
		// 8 games per season
		// Monday League - one set of games
		// Thursday League - one set of games
		match.dateTime = moment(date).set(time);
		match.homeTeam.sessionSchedule.lastScheduledGame = match.dateTime;
		match.awayTeam.sessionSchedule.lastScheduledGame = match.dateTime;
	}
}
