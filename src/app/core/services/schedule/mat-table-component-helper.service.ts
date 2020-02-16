import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { filterOnDateValue, filterOnInputValue, filterOnLeagueID, filterOnTeamID } from 'src/app/shared/helpers/filter-predicate.function';
import Match from '../../models/schedule/classes/match.model';
import { SportTypesLeaguesPairs, SportTypesLeaguesPairsWithTeams } from '../../models/schedule/sport-types-leagues-pairs.model';
import { ScheduleComponentHelperService } from './schedule-administration/schedule-component-helper.service';

/**
 * @description This service is responsible for handling actions related
 * to the mat table displayed by the schedule
 */
@Injectable()
export class MatTableComponentHelperService {
	constructor(private scheduleHelper: ScheduleComponentHelperService) {}

	/**
	 * @description Used by the components to render the schedule/schedule-preview
	 * determines what the title of the given schedule should be. It could be 'All'
	 * 'Basketball - Monday' etc.
	 * @returns current title table league selection
	 */
	getCurrentTitleTableLeagueSelection(pairs: SportTypesLeaguesPairs[] | SportTypesLeaguesPairsWithTeams[], selectedLeagueValue: string): string {
		const leagueID: string = selectedLeagueValue;
		const filteredPairs = this.scheduleHelper.filterPairsForGeneratedSessions(pairs, [leagueID]);
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

	applyMatTableDateSelectionFilter(dataSource: MatTableDataSource<Match>): void {
		dataSource.filterPredicate = filterOnDateValue;
	}

	/**
	 * @description Determines if the league selection drop down list should be displayed or not.
	 * If it is a single league we are displaying, we want to omit league selection drop down
	 * @returns true if there are more than one league in the pairs array
	 */
	showLeagueSelectionForMatTable(pairs: SportTypesLeaguesPairs[]): boolean {
		if (pairs.length > 0 && pairs.length === 1) {
			if (pairs[0].leagues.length > 1) {
				return true;
			} else {
				return false;
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

	filterOnDateValue(filterValue: string, datasource: MatTableDataSource<Match>): string {
		datasource.filter = filterValue;
		return filterValue;
	}

	filterTodaysMatches(allMatches: Match[]): Match[] {
		const todaysMatches = allMatches.filter((match) => {
			if (typeof match.dateTime === 'number') {
				const today = moment(new Date());
				const matchDateTime = moment.unix(match.dateTime);
				if (matchDateTime.isSame(today, 'day')) {
					return true;
				}
			}
		});

		return todaysMatches;
	}
}
