import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { ScheduleFacadeService } from './../../../core/services/schedule/schedule-facade.service';
import { VIEW_ALL } from './../../../shared/constants/the-p-league-constants';

@Component({
	selector: 'app-leagues-session-schedules',
	templateUrl: './leagues-session-schedules.component.html',
	styleUrls: ['./leagues-session-schedules.component.scss'],
	providers: [ScheduleComponentHelperService]
})
export class LeaguesSessionSchedulesComponent implements OnInit {
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
			return pairs.map((pair) => {
				const pairWithTeams: SportTypesLeaguesPairsWithTeams = {
					name: pair.name,
					id: pair.id,
					leagues: pair.leagues.map((l) => {
						return {
							id: l.id,
							name: l.name,
							teams: filterFn(l.id).map((t) => {
								return {
									id: t.id,
									name: t.name
								};
							})
						};
					})
				};
				return pairWithTeams;
			});
		})
	);
	displayLeagueID = VIEW_ALL;
	displayTeamID = VIEW_ALL;

	constructor(private scheduleFacade: ScheduleFacadeService, private scheduleComponentHelper: ScheduleComponentHelperService) {}

	ngOnInit() {}

	onLeagueSelectionChanged(leagueID: string): void {
		this.displayTeamID = VIEW_ALL;
		this.displayLeagueID = this.scheduleComponentHelper.filterOnLeagueID(leagueID, this.leaguesSessionSchduleDataSource);
	}

	onTeamSelectionChanged(teamID: string): void {
		this.displayLeagueID = VIEW_ALL;
		this.displayTeamID = this.scheduleComponentHelper.filterOnTeamID(teamID, this.leaguesSessionSchduleDataSource);
	}
}
