import { MatchResultStatus } from './match-result-status.enum';

export interface MatchResult {
	matchResultId?: string;
	matchId?: string;
	status: MatchResultStatus;
	awayTeamScore?: number;
	homeTeamScore?: number;
	score?: string;
	wonTeamName?: string;
	lostTeamName?: string;
}
