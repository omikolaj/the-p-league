import { MatchResult } from '../match-result.model';

// Represents two teams facing each other
export default class Match {
	id?: string;
	dateTime?: number | string;
	homeTeamId: string;
	homeTeamName: string;
	awayTeamId: string;
	awayTeamName: string;
	sessionId: string;
	leagueID?: string;
	matchResult?: MatchResult;

	constructor(home: string, away: string, homeTeamID: string, awayTeamID: string) {
		this.homeTeamName = home;
		this.awayTeamName = away;
		this.homeTeamId = homeTeamID;
		this.awayTeamId = awayTeamID;
	}
}
