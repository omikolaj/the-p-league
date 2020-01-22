import * as moment from 'moment';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { VIEW_ALL } from '../constants/the-p-league-constants';

export function filterOnLeagueID(match: Match, leagueID: string): boolean {
	return leagueID === VIEW_ALL ? true : match.leagueID === leagueID;
}

export function filterOnTeamID(match: Match, teamID: string): boolean {
	if (teamID === VIEW_ALL) {
		return true;
	} else if (match.homeTeamId === teamID) {
		return true;
	} else if (match.awayTeamId === teamID) {
		return true;
	}
}

export function filterOnDateValue(match: Match, dateValue: string): boolean {
	const filterDate = moment(dateValue);
	if (typeof match.dateTime === 'number') {
		if (moment.unix(match.dateTime).diff(filterDate, 'days') === 0) {
			return true;
		}
	}
}

export function filterOnInputValue(match: Match, filterValue: string): boolean {
	if (match.homeTeamName.toLowerCase().includes(filterValue)) {
		return true;
	}
	if (match.awayTeamName.toLowerCase().includes(filterValue)) {
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
