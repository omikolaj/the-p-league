import { Injectable } from '@angular/core';
import { MatSelectionListChange, MatTableDataSource } from '@angular/material';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairs, SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { filterOnInputValue, filterOnLeagueID, filterOnTeamID } from 'src/app/shared/helpers/filter-predicate.function';
import { Team } from './../../../models/schedule/team.model';

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
		console.log('filtering pairs');
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

	generatePairsWithTeams(pair: SportTypesLeaguesPairs, filterFunction: (id: string) => Team[]): SportTypesLeaguesPairsWithTeams {
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

	// #region Mat Table functions

	/**
	 * @description Used by the components to render the schedule/schedule-preview
	 * determines what the title of the given schedule should be. It could be 'All'
	 * 'Basketball - Monday' etc.
	 * @returns current title table league selection
	 */
	getCurrentTitleTableLeagueSelection(pairs: SportTypesLeaguesPairs[], selectedLeagueValue: string): string {
		const leagueID: string = selectedLeagueValue;
		const filteredPairs = this.filterPairsForGeneratedSessions(pairs, [leagueID]);
		let title = '';
		if (filteredPairs) {
			if (filteredPairs.length > 0) {
				const pair = filteredPairs[0];
				title = `${pair.name} - `;
				if (pair.leagues) {
					if (pair.leagues.length > 0) {
						title += `${pair.leagues[0].name}`;
					}
				}
			}
		}
		return title === '' ? 'All' : title;
	}

	/**
	 * @description Used by the components that display schedule/schedule-preview
	 * It applies the predicate function to the passed in datasource and then filters
	 * the data based on the passed in filterValue
	 */
	applyMatTableFilterValue(filterValue: string, dataSource: MatTableDataSource<Match>): void {
		dataSource.filterPredicate = filterOnInputValue;
		dataSource.filter = filterValue.trim().toLocaleLowerCase();
		if (dataSource.paginator) {
			dataSource.paginator.firstPage();
		}
	}

	/**
	 * @description Applies filterOnLeagueID predicate function onto the passed in
	 * MatTableDataSource
	 * @param dataSource
	 */
	applyMatTableLeagueSelectionFilter(dataSource: MatTableDataSource<Match>): void {
		dataSource.filterPredicate = filterOnLeagueID;
	}

	applyMatTableTeamSelectionFilter(dataSource: MatTableDataSource<Match>): void {
		dataSource.filterPredicate = filterOnTeamID;
	}

	/**
	 * @description Determines if the league selection drop down list should be displayed or not.
	 * If it is a single league we are displaying we want to omit league selection drop down
	 * @returns true if there are more than one league in the pairs array
	 */
	showLeagueSelectionForMatTable(pairs: SportTypesLeaguesPairs[]): boolean {
		if (pairs.length > 0 && pairs.length === 1) {
			if (pairs[0].leagues.length > 1) {
				return true;
			}
		} else {
			return true;
		}
	}

	filterOnLeagueID(leagueID: string, dataSource: MatTableDataSource<Match>): string {
		dataSource.filter = leagueID;
		return leagueID;
	}

	filterOnTeamID(teamID: string, datasource: MatTableDataSource<Match>): string {
		datasource.filter = teamID;
		return teamID;
	}

	// #endregion
}
