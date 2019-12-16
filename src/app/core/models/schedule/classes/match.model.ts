import * as moment from 'moment';
import { AwayTeam, HomeTeam } from '../team.model';

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
}
