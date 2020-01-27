import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { MatchResult } from 'src/app/core/models/schedule/match-result.model';
import { SportTypesLeaguesPairs, SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { MatTableComponentHelperService } from 'src/app/core/services/schedule/mat-table-component-helper.service';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { VIEW_ALL } from 'src/app/shared/constants/the-p-league-constants';
import { ScheduleAdministrationFacade } from './../../../core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { CdkDetailRowService } from './../../../shared/directives/cdk-detail-row/cdk-detail-row.service';

@Component({
	selector: 'app-scoreboards',
	templateUrl: './scoreboards.component.html',
	styleUrls: ['./scoreboards.component.scss'],
	providers: [ScheduleComponentHelperService, MatTableComponentHelperService, CdkDetailRowService]
})
export class ScoreboardsComponent implements OnInit, OnDestroy {
	private pairs$ = combineLatest(this.scheduleFacade.sessionsSportLeaguePairs$, this.scheduleFacade.sessionsLeagueIDs$).pipe(
		filter(([pairs, leagues]) => leagues.length !== 0 && pairs.length !== 0),
		map(([pairs, leagues]) => this.scheduleComponentHelper.filterPairsForGeneratedSessions(pairs, leagues)),
		startWith([] as SportTypesLeaguesPairs[])
	);

	filteredPairs$: Observable<SportTypesLeaguesPairsWithTeams[]> = combineLatest(
		this.pairs$,
		this.scheduleFacade.sessionsTeamsSessionsByLeagueIDFn$
	).pipe(
		map(([pairs, filterFn]) => {
			return pairs.map((pair) => this.scheduleComponentHelper.generatePairsWithTeamsForTeamSessions(pair, filterFn));
		})
	);
	todaysTitle = "Today's Games";
	allDisplayLeagueID = VIEW_ALL;
	todayDisplayLeagueID = VIEW_ALL;
	allDisplayTeamID = VIEW_ALL;
	todayDisplayTeamID = VIEW_ALL;
	leaguesSessionSchduleDataSource = new MatTableDataSource<Match>();
	todayDataSource = new MatTableDataSource<Match>();
	admin = true;
	displayColumns = ['home', 'result', 'actions', 'away', 'date'];
	private unsubscribed$: Subject<void> = new Subject();

	constructor(
		private scheduleFacade: ScheduleAdministrationFacade,
		private scheduleComponentHelper: ScheduleComponentHelperService,
		private matTableHelper: MatTableComponentHelperService
	) {}

	ngOnInit(): void {
		this.scheduleFacade.sessionsMatches$
			.pipe(
				takeUntil(this.unsubscribed$),
				tap((matches) => {
					this.leaguesSessionSchduleDataSource.data = matches;
					this.todayDataSource.data = this.matTableHelper.filterTodaysMatches(matches);
				})
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.unsubscribed$.next();
		this.unsubscribed$.complete();
	}

	onLeagueSelectionChanged(leagueID: string, scheduleType: 'all' | 'today'): void {
		switch (scheduleType) {
			case 'all':
				this.allDisplayTeamID = VIEW_ALL;
				this.allDisplayLeagueID = this.matTableHelper.filterOnLeagueID(leagueID, this.leaguesSessionSchduleDataSource);
				break;
			case 'today':
				this.todayDisplayTeamID = VIEW_ALL;
				this.todayDisplayLeagueID = this.matTableHelper.filterOnLeagueID(leagueID, this.todayDataSource);
				break;
			default:
				break;
		}
	}

	onTeamSelectionChanged(teamID: string, scheduleType: 'all' | 'today'): void {
		// this.displayLeagueID = VIEW_ALL;
		switch (scheduleType) {
			case 'all':
				this.allDisplayLeagueID = VIEW_ALL;
				this.allDisplayTeamID = this.matTableHelper.filterOnTeamID(teamID, this.leaguesSessionSchduleDataSource);
				break;
			case 'today':
				this.todayDisplayLeagueID = VIEW_ALL;
				this.todayDisplayTeamID = this.matTableHelper.filterOnTeamID(teamID, this.todayDataSource);
				break;
			default:
				break;
		}
	}

	onDateSelectionChanged(filterValue: string): void {
		this.matTableHelper.filterOnDateValue(filterValue, this.leaguesSessionSchduleDataSource);
	}

	onFilterValueChanged(filterValue: string, scheduleType: 'all' | 'today'): void {
		switch (scheduleType) {
			case 'all':
				this.matTableHelper.applyMatTableFilterValue(filterValue, this.leaguesSessionSchduleDataSource);
				break;
			case 'today':
				this.matTableHelper.applyMatTableFilterValue(filterValue, this.todayDataSource);
				break;
			default:
				break;
		}
	}

	onMatchReported(event: { result: MatchResult; sessionID: string }): void {
		this.scheduleFacade.reportMatch(event);
	}
}
