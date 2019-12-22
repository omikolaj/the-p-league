import Match from 'src/app/core/models/schedule/classes/match.model';
import { VIEW_ALL } from 'src/app/shared/helpers/constants/the-p-league-constants';

export function filterOnLeagueID(match: Match, leagueID: string): boolean {
	return leagueID === VIEW_ALL ? true : match.leagueID === leagueID;
}

export function filterOnInputValue(match: Match, filterValue: string): boolean {
	if (match.homeTeam.name.toLowerCase().includes(filterValue)) {
		return true;
	}
	if (match.awayTeam.name.toLowerCase().includes(filterValue)) {
		return true;
	}
	return false;
}
