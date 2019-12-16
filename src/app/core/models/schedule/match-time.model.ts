// Reprsents the time for a match
export interface MatchTime {
	matchId?: number;
	hour?: number | string;
	minute?: number | string;
	period?: 'am' | 'pm';
}
