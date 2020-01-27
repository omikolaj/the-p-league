import { Injectable } from '@angular/core';
import { MatSelectionListChange } from '@angular/material';
import { SportTypesLeaguesPairs, SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { TeamSession } from 'src/app/core/models/schedule/team-session.model';
import { Team } from './../../../models/schedule/team.model';

@Injectable()
export class ScheduleComponentHelperService {
	constructor() {}

	onSelectionChange(selectedEvent: MatSelectionListChange): string[] {
		return selectedEvent.source.selectedOptions.selected.map((id) => id.value);
	}

	/**
	 * @description Takes the list of sport types league pairs and filters it down to a list of
	 * sport types league pairs based on the sports and leagues user had generated sessions for.
	 * This list is used to populate the drop down list so user can select which session they want to
	 * view matches for. We only care to display a list of sports and leagues that user generated sessions for
	 * @returns filtered pairs
	 */
	filterPairsForGeneratedSessions(
		pairs: SportTypesLeaguesPairs[] | SportTypesLeaguesPairsWithTeams[],
		sessionsLeagueIDs: string[]
	): SportTypesLeaguesPairs[] {
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

	generatePairsWithTeamsForTeamSessions(
		pair: SportTypesLeaguesPairs,
		filterFunction: (id: string) => TeamSession[]
	): SportTypesLeaguesPairsWithTeams {
		return {
			name: pair.name,
			id: pair.id,
			leagues: pair.leagues.map((l) => {
				return {
					id: l.id,
					name: l.name,
					teams: filterFunction(l.id).map((tS) => {
						return {
							id: tS.teamId,
							name: tS.teamName
						};
					})
				};
			})
		};
	}

	generatePairsWithTeamsForTeams(pair: SportTypesLeaguesPairs, filterFunction: (id: string) => Team[]): SportTypesLeaguesPairsWithTeams {
		return {
			name: pair.name,
			id: pair.id,
			leagues: pair.leagues.map((l) => {
				return {
					id: l.id,
					name: l.name,
					teams: filterFunction(l.id).map((t) => {
						return {
							id: t.id,
							name: t.name
						};
					})
				};
			})
		};
	}

	// #endregion
}
