import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { ScheduleFacadeService } from '../../../core/services/schedule/schedule-facade.service';
import { VIEW_ALL } from '../../../shared/constants/the-p-league-constants';

@Component({
	selector: 'app-leagues-session-schedules',
	templateUrl: './leagues-session-schedules.component.html',
	styleUrls: ['./leagues-session-schedules.component.scss'],
	providers: [ScheduleComponentHelperService]
})
export class LeaguesSessionSchedulesComponent implements OnInit {
	todayDataSource: MatTableDataSource<Match>;
	todaysTitle = "Today's Games";
	leaguesSessionSchduleDataSource = new MatTableDataSource<Match>(this.scheduleFacade.activeSessionsMatches);
	private pairs$ = combineLatest(this.scheduleFacade.sportTypesLeaguesPairs$, this.scheduleFacade.leagues$).pipe(
		filter(([pairs, leagues]) => leagues.length !== 0 && pairs.length !== 0),
		map(([pairs, leagues]) =>
			this.scheduleComponentHelper.filterPairsForGeneratedSessions(
				pairs,
				leagues.map((l) => l.id)
			)
		)
	);

	filteredPairs$: Observable<SportTypesLeaguesPairsWithTeams[]> = combineLatest(this.pairs$, this.scheduleFacade.getAllTeamsForLeagueID$).pipe(
		map(([pairs, filterFn]) => {
			return pairs.map((pair) => this.scheduleComponentHelper.generatePairsWithTeams(pair, filterFn));
		})
	);
	displayLeagueID = VIEW_ALL;
	displayTeamID = VIEW_ALL;

	constructor(private scheduleFacade: ScheduleFacadeService, private scheduleComponentHelper: ScheduleComponentHelperService) {}

	ngOnInit(): void {
		// set up todays data source
		this.todayDataSource = this.filterTodaysMatches();
	}

	onLeagueSelectionChanged(leagueID: string): void {
		this.displayTeamID = VIEW_ALL;
		this.displayLeagueID = this.scheduleComponentHelper.filterOnLeagueID(leagueID, this.leaguesSessionSchduleDataSource);
	}

	onTeamSelectionChanged(teamID: string): void {
		this.displayLeagueID = VIEW_ALL;
		this.displayTeamID = this.scheduleComponentHelper.filterOnTeamID(teamID, this.leaguesSessionSchduleDataSource);
	}

	onDateSelectionChanged(filterValue: string, scheduleType: 'all' | 'today'): void {
		switch (scheduleType) {
			case 'all':
				this.scheduleComponentHelper.filterOnDateValue(filterValue, this.leaguesSessionSchduleDataSource);
				break;
			case 'today':
				this.scheduleComponentHelper.filterOnDateValue(filterValue, this.todayDataSource);
				break;
			default:
				break;
		}
	}

	onFilterValueChanged(filterValue: string): void {
		this.scheduleComponentHelper.applyMatTableFilterValue(filterValue, this.leaguesSessionSchduleDataSource);
	}

	private filterTodaysMatches(): MatTableDataSource<Match> {
		const allMatches = this.scheduleFacade.activeSessionsMatches;
		const todaysMatches = allMatches.filter((match) => {
			if (typeof match.dateTime === 'number') {
				const today = moment(new Date());
				const matchDateTime = moment.unix(match.dateTime);
				if (today.diff(matchDateTime, 'days') === 0) {
					return true;
				}
			}
		});

		return new MatTableDataSource(todaysMatches);
	}
}
