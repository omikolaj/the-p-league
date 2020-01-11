import { MatchResult } from '../match-result.model';
import { AwayTeam, HomeTeam } from '../team.model';

// Represents two teams facing each other
export default class Match {
	id?: string;
	dateTime?: number | string;
	homeTeam: HomeTeam;
	awayTeam: AwayTeam;
	sessionID: string;
	leagueID?: string;
	matchResult?: MatchResult;

	constructor(home: HomeTeam, away: AwayTeam) {
		this.homeTeam = home;
		this.awayTeam = away;
	}
}
