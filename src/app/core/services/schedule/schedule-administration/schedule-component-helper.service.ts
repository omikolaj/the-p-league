import { Injectable } from '@angular/core';
import { MatSelectionListChange } from '@angular/material';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';

@Injectable()
export class ScheduleComponentHelperService {
	constructor() {}

	onSelectionChange(selectedEvent: MatSelectionListChange): string[] {
		const ids: string[] = [];
		for (let index = 0; index < selectedEvent.source.selectedOptions.selected.length; index++) {
			const matListOption = selectedEvent.source.selectedOptions.selected[index];
			ids.push(matListOption.value);
		}
		return ids;
	}

	/**
	 * @description Takes the list of sport types league pairs and filters it down to a list of
	 * sport types league pairs based on the sports and leagues user had generated sessions for.
	 * This list is used to populate the drop down list so user can select which session they want to
	 * view matches for. We only care to display a list of sports and leagues that user generated sessions for
	 * @returns filtered pairs
	 */
	filterPairsForGeneratedSessions(pairs: SportTypesLeaguesPairs[], sessionsLeagueIDs: string[]): SportTypesLeaguesPairs[] {
		return pairs
			.filter((s) => {
				return s.leagues.some((l) => {
					// check if the session league IDs list contains an id for the
					// currently iterating league, if it does return true, if it does
					// not return false. This will filter down the sports
					const indexOf = sessionsLeagueIDs.indexOf(l.id);
					return indexOf !== -1;
				});
			})
			.map((sport) => {
				const newSport = Object.assign({}, sport);
				newSport.leagues = newSport.leagues.filter((l) => {
					// iterate over all sports and for each sport
					// filter those leagues for which user did not create a session
					const indexOf = sessionsLeagueIDs.indexOf(l.id);
					return indexOf !== -1;
				});
				return newSport;
			});
	}

	/**
	 * @description Loads initial set of matches for the first generated session
	 * @returns first session matches
	 */
	// TODO remove. Currently NOT in use
	loadMatchesForFirstSession(matchesSnapshot: Match[], leagueIDs: string[]): Match[] {
		let matches: Match[] = [];
		// if we have at least one leagueID display the first one as the default one
		if (leagueIDs.length > 0) {
			matches = matchesSnapshot.filter((match) => match.leagueID === leagueIDs[0]);
		} else {
			matches = [];
		}
		return matches;
	}
}
