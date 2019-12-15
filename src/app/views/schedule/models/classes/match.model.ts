import * as moment from 'moment';
import { AwayTeam, HomeTeam } from '../interfaces/team.model';

// Represents two teams facing each other
export default class Match {
	dateTime?: moment.Moment | string;
	homeTeam: HomeTeam;
	awayTeam: AwayTeam;
	sessionID: string;
	leagueID?: string;

	constructor(home: HomeTeam, away: AwayTeam) {
		this.homeTeam = home;
		this.awayTeam = away;
	}

	// schedule(date: moment.Moment, time: MomentSetObject, match: Match): void {
	// 	// 8 games per season
	// 	// Monday League - one set of games
	// 	// Thursday League - one set of games
	// 	match.dateTime = moment(date).set(time);
	// 	// match.homeTeam.sessionSchedule.lastScheduledGame = match.dateTime;
	// 	// match.awayTeam.sessionSchedule.lastScheduledGame = match.dateTime;
	// }
}
