import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { MatchResultStatus } from 'src/app/core/models/schedule/match-result-status.enum';
import { SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { matchSortingFn } from 'src/app/shared/helpers/sorting-data-accessor.function';
import { BYE_WEEK_DATE_TEXT, VIEW_ALL } from '../../constants/the-p-league-constants';

@Component({
	selector: 'app-session-schedules',
	templateUrl: './session-schedules.component.html',
	styleUrls: ['./session-schedules.component.scss']
})
export class SessionSchedulesComponent implements OnInit {
	// #region Properties

	matchResult = MatchResultStatus;
	filterValue: FormControl = this.fb.control(null);
	viewAll = VIEW_ALL;
	displayedColumns: string[] = ['home', 'result', 'away', 'date'];
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;

	selectedLeague: FormControl = this.fb.control(null);
	@Input() set displayLeagueID(value: string) {
		this.selectedLeague.setValue(value);
	}

	selectedTeam: FormControl = this.fb.control(null);
	@Input() set displayTeamID(value: string) {
		this.selectedTeam.setValue(value);
	}

	@Input() dataSource: MatTableDataSource<Match>;
	@Input() pairs: SportTypesLeaguesPairsWithTeams[] = [];
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	// #endregion

	// #region Event Emitters
	@Output() leagueChanged = new EventEmitter<string>();
	@Output() teamChanged = new EventEmitter<string>();
	// TODO delete. Currently not used
	// @Output() schedulesPublished = new EventEmitter<void>();
	// #endregion

	constructor(private fb: FormBuilder, private scheduleHelper: ScheduleComponentHelperService) {}

	ngOnInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
		this.dataSource.sortingDataAccessor = matchSortingFn;
		console.log('logging enum', this.matchResult[this.matchResult['Pending']]);
	}

	// #region Event Handlers

	onApplyFilter(filterValue: string): void {
		this.scheduleHelper.applyMatTableFilterValue(filterValue, this.dataSource);
	}

	onLeagueSelectionChange(): void {
		this.scheduleHelper.applyMatTableLeagueSelectionFilter(this.dataSource);
		// When using selection drop down to filter data we want to clear the filter input field
		this.filterValue.setValue('');
		this.leagueChanged.emit(this.selectedLeague.value);
	}

	onTeamSelectionChange(): void {
		this.scheduleHelper.applyMatTableTeamSelectionFilter(this.dataSource);
		// When using selection drop down to filter data we want to clear the filter input field
		this.filterValue.setValue('');
		this.teamChanged.emit(this.selectedTeam.value);
	}

	// #endregion

	// #region Methods

	showLeagueSelection(): boolean {
		return this.scheduleHelper.showLeagueSelectionForMatTable(this.pairs);
	}

	getCurrentTitle(): string {
		return this.scheduleHelper.getCurrentTitleTableLeagueSelection(this.pairs, this.selectedLeague.value);
	}

	// #endregion
}
