import * as moment from 'moment';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { VIEW_ALL } from '../constants/the-p-league-constants';

export function filterOnLeagueID(match: Match, leagueID: string): boolean {
	return leagueID === VIEW_ALL ? true : match.leagueID === leagueID;
}

export function filterOnTeamID(match: Match, teamID: string): boolean {
	if (teamID === VIEW_ALL) {
		return true;
	} else if (match.homeTeam.id === teamID) {
		return true;
	} else if (match.awayTeam.id === teamID) {
		return true;
	}
}

export function filterOnInputValue(match: Match, filterValue: string): boolean {
	if (match.homeTeam.name.toLowerCase().includes(filterValue)) {
		return true;
	}
	if (match.awayTeam.name.toLowerCase().includes(filterValue)) {
		return true;
	}
	if (
		moment
			.unix(match.dateTime as number)
			.format('dddd MMM DD YYYY hh:mm a')
			.toLocaleLowerCase()
			.includes(filterValue)
	) {
		return true;
	}
	return false;
}
