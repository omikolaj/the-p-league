import Match from './classes/match.model';
import { MatchResultStatus } from './match-result-status.enum';

export interface MatchResult {
	matchResultId?: string;
	matchId?: string;
	match?: Match;
	leagueId?: string;
	status: MatchResultStatus;
	awayTeamScore?: number;
	awayTeamId?: string;
	homeTeamScore?: number;
	homeTeamId?: string;
	score?: string;
	wonTeamName?: string;
	lostTeamName?: string;
	sessionId?: string;
}
