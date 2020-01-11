import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDatepicker, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { MatchResultStatus } from 'src/app/core/models/schedule/match-result-status.enum';
import { SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { matchSortingFn } from 'src/app/shared/helpers/sorting-data-accessor.function';
import { BYE_WEEK_DATE_TEXT, VIEW_ALL } from '../../constants/the-p-league-constants';
import { MatTableComponentHelperService } from './../../../core/services/schedule/mat-table-component-helper.service';

@Component({
	selector: 'app-session-schedules',
	templateUrl: './session-schedules.component.html',
	styleUrls: ['./session-schedules.component.scss'],
	providers: [MatTableComponentHelperService]
})
export class SessionSchedulesComponent implements OnInit {
	// #region Properties

	matchResult = MatchResultStatus;
	filterValue: FormControl = this.fb.control(null);
	viewAll = VIEW_ALL;
	displayedColumns: string[] = ['home', 'result', 'away', 'date'];
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;
	filterDatepickerValue = '';
	// TODO enable this dynamically. Set to try only for mobile false for desktop
	calendarTouchUi = true;

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
	@Input() title = '';
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('filterByDatepicker', { static: false }) filterDatepicker: MatDatepicker<moment.Moment>;

	// #endregion

	// #region Event Emitters
	@Output() leagueChanged = new EventEmitter<string>();
	@Output() teamChanged = new EventEmitter<string>();
	@Output() filterByDateChanged = new EventEmitter<string>();
	@Output() filterByInputChanged = new EventEmitter<string>();
	// #endregion

	constructor(private fb: FormBuilder, private matTableHelper: MatTableComponentHelperService) {}

	ngOnInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
		this.dataSource.sortingDataAccessor = matchSortingFn;
		console.log('logging enum', this.matchResult[this.matchResult['Pending']]);
	}

	// #region Event Handlers

	onApplyFilter(filterValue: string): void {
		this.filterByInputChanged.emit(filterValue);
	}

	onLeagueSelectionChange(): void {
		this.matTableHelper.applyMatTableLeagueSelectionFilter(this.dataSource);
		// When using selection drop down to filter data we want to clear the filter input field
		this.filterValue.setValue('');
		this.leagueChanged.emit(this.selectedLeague.value);
	}

	onTeamSelectionChange(): void {
		this.matTableHelper.applyMatTableTeamSelectionFilter(this.dataSource);
		// When using selection drop down to filter data we want to clear the filter input field
		this.filterValue.setValue('');
		this.teamChanged.emit(this.selectedTeam.value);
	}

	onDatePickerOpened(): void {
		// on open reset the picker filter
		this.filterDatepicker.select(undefined);
	}

	onDateChange(input): void {
		this.matTableHelper.applyMatTableDateSelectionFilter(this.dataSource);
		this.filterByDateChanged.emit(moment(input.target.value).isValid() ? moment(input.target.value).format('MM/DD/YYYY') : null);
	}

	// #endregion

	// #region Methods

	showLeagueSelection(): boolean {
		return this.matTableHelper.showLeagueSelectionForMatTable(this.pairs);
	}

	getCurrentTitle(): string {
		return this.matTableHelper.getCurrentTitleTableLeagueSelection(this.pairs, this.selectedLeague.value);
	}

	// #endregion
}
