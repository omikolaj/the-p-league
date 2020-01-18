import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { MatchResult } from 'src/app/core/models/schedule/match-result.model';
import { SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { MatTableComponentHelperService } from 'src/app/core/services/schedule/mat-table-component-helper.service';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { VIEW_ALL } from 'src/app/shared/constants/the-p-league-constants';
import { ScheduleAdministrationFacade } from './../../../core/services/schedule/schedule-administration/schedule-administration-facade.service';

@Component({
	selector: 'app-scoreboards',
	templateUrl: './scoreboards.component.html',
	styleUrls: ['./scoreboards.component.scss'],
	providers: [ScheduleComponentHelperService, MatTableComponentHelperService]
})
export class ScoreboardsComponent implements OnInit, OnDestroy {
	private pairs$ = combineLatest(this.scheduleFacade.sportTypesLeaguesPairs$, this.scheduleFacade.leagues$).pipe(
		filter(([pairs, leagues]) => leagues.length !== 0 && pairs.length !== 0),
		map(([pairs, leagues]) =>
			this.scheduleComponentHelper.filterPairsForGeneratedSessions(
				pairs,
				leagues.map((l) => l.id)
			)
		),
		tap((pairs) => console.log('private pairs', pairs))
	);

	filteredPairs$: Observable<SportTypesLeaguesPairsWithTeams[]> = combineLatest(this.pairs$, this.scheduleFacade.getAllTeamsForLeagueID$).pipe(
		map(([pairs, filterFn]) => {
			return pairs.map((pair) => this.scheduleComponentHelper.generatePairsWithTeams(pair, filterFn));
		}),
		tap((pairs) => console.log('logging pairs', pairs))
	);

	displayLeagueID = VIEW_ALL;
	displayTeamID = VIEW_ALL;
	leaguesSessionSchduleDataSource = new MatTableDataSource<Match>(this.scheduleFacade.activeSessionsMatches);
	admin = true;
	displayColumns = ['home', 'result', 'actions', 'away', 'date'];
	private unsubscribe$: Subject<void> = new Subject();

	constructor(
		private scheduleFacade: ScheduleAdministrationFacade,
		private scheduleComponentHelper: ScheduleComponentHelperService,
		private matTableHelper: MatTableComponentHelperService
	) {}

	ngOnInit(): void {
		this.scheduleFacade.activeSessionMatches$
			.pipe(
				takeUntil(this.unsubscribe$),
				tap((matches) => (this.leaguesSessionSchduleDataSource = new MatTableDataSource(matches)))
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	onLeagueSelectionChanged(leagueID: string): void {
		this.displayTeamID = VIEW_ALL;
		this.displayLeagueID = this.matTableHelper.filterOnLeagueID(leagueID, this.leaguesSessionSchduleDataSource);
	}

	onTeamSelectionChanged(teamID: string): void {
		this.displayLeagueID = VIEW_ALL;
		this.displayTeamID = this.matTableHelper.filterOnTeamID(teamID, this.leaguesSessionSchduleDataSource);
	}

	onDateSelectionChanged(filterValue: string): void {
		this.matTableHelper.filterOnDateValue(filterValue, this.leaguesSessionSchduleDataSource);
	}

	onFilterValueChanged(filterValue: string, scheduleType: 'all' | 'today'): void {
		this.matTableHelper.applyMatTableFilterValue(filterValue, this.leaguesSessionSchduleDataSource);
	}

	onMatchReported(matchResult: MatchResult): void {
		console.log('inside onMatchReported', matchResult);
		this.scheduleFacade.reportMatch(matchResult);
	}
}
