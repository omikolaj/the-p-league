import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { MatchResultStatus } from 'src/app/core/models/schedule/match-result-status.enum';
import { MatchResult } from 'src/app/core/models/schedule/match-result.model';
import { SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { matchSortingFn } from 'src/app/shared/helpers/sorting-data-accessor.function';
import { BYE_WEEK_DATE_TEXT, VIEW_ALL } from '../../constants/the-p-league-constants';
import { SnackBarService } from '../snack-bar/snack-bar-service.service';
import { MatTableComponentHelperService } from './../../../core/services/schedule/mat-table-component-helper.service';
import { SnackBarEvent } from './../snack-bar/snack-bar-service.service';

@Component({
	selector: 'app-session-schedules',
	templateUrl: './session-schedules.component.html',
	styleUrls: ['./session-schedules.component.scss'],
	providers: [MatTableComponentHelperService],
	animations: [
		trigger('detailExpand', [
			state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
			state('*', style({ height: '*', visibility: 'visible' })),
			transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		])
	]
})
export class SessionSchedulesComponent implements OnInit {
	// #region Properties

	matchResult = MatchResultStatus;
	filterValue: FormControl = this.fb.control(null);
	viewAll = VIEW_ALL;
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;
	filterDatepickerValue = '';
	@Input() mobile = true;
	@Input() sortOrder: 'asc' | 'desc' = 'asc';
	displayedColumns = ['home', 'result', 'away', 'date'];
	matchReportForm: FormGroup;

	selectedLeague: FormControl = this.fb.control(null);
	@Input() set displayLeagueID(value: string) {
		this.selectedLeague.setValue(value);
	}

	selectedTeam: FormControl = this.fb.control(null);
	@Input() set displayTeamID(value: string) {
		this.selectedTeam.setValue(value);
	}
	@Input() admin = false;
	// currently not consumed. Future functionality if desired. Too Many filters
	@Input() searchTermFilter = false;
	private _dataSource: MatTableDataSource<Match>;
	get dataSource(): MatTableDataSource<Match> {
		return this._dataSource;
	}

	@Input() set dataSource(value: MatTableDataSource<Match>) {
		this._dataSource = value;
		this.tableSetUp();
	}

	@Input() pairs: SportTypesLeaguesPairsWithTeams[] = [];
	@Input() title = '';
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('filterByDatepicker') filterDatepicker: MatDatepicker<moment.Moment>;

	// #endregion

	// #region Event Emitters
	@Output() leagueChanged = new EventEmitter<string>();
	@Output() teamChanged = new EventEmitter<string>();
	@Output() filterByDateChanged = new EventEmitter<string>();
	@Output() filterByInputChanged = new EventEmitter<string>();
	@Output() matchReported = new EventEmitter<{ result: MatchResult; sessionID: string }>();
	@Output() filterApplied = new EventEmitter<void>();
	// #endregion

	constructor(private fb: FormBuilder, private matTableHelper: MatTableComponentHelperService, private snackBarService: SnackBarService) {}

	ngOnInit(): void {
		this.initForms();
	}

	// #region Event Handlers

	onApplyFilter(filterValue: string): void {
		this.filterByInputChanged.emit(filterValue);
	}

	filterWasApplied(type: 'league' | 'team' | 'date', value: string): void {
		let filterOn = '';
		let target;
		switch (type) {
			case 'league':
				this.pairs.find((p) => (target = p.leagues.find((l) => l.id === value)));
				if (target) {
					filterOn = `${target.name}`;
				}
				break;
			case 'team':
				this.pairs.find((p) => p.leagues.find((l) => (target = l.teams.find((t) => t.id === value))));
				if (target) {
					filterOn = `${target.name}`;
				}
				break;
			case 'date':
				filterOn = value;
				break;
			default:
				break;
		}
		this.snackBarService.openSnackBarFromComponent(`Filtered by ${filterOn}`, 'Dismiss', SnackBarEvent.Success);
	}

	onLeagueSelectionChange(): void {
		this.matTableHelper.applyMatTableLeagueSelectionFilter(this.dataSource);
		// When using selection drop down to filter data we want to clear the filter input field
		this.filterValue.setValue('');
		this.leagueChanged.emit(this.selectedLeague.value);
		this.filterWasApplied('league', this.selectedLeague.value);
	}

	onTeamSelectionChange(): void {
		this.matTableHelper.applyMatTableTeamSelectionFilter(this.dataSource);
		// When using selection drop down to filter data we want to clear the filter input field
		this.filterValue.setValue('');
		this.teamChanged.emit(this.selectedTeam.value);
		this.filterWasApplied('team', this.selectedTeam.value);
	}

	onDatePickerOpened(): void {
		// on open reset the picker filter
		this.filterDatepicker.select(undefined);
	}

	onDateChange(input): void {
		this.matTableHelper.applyMatTableDateSelectionFilter(this.dataSource);
		this.filterByDateChanged.emit(moment(input.target.value).isValid() ? moment(input.target.value).format('MM/DD/YYYY') : null);
		if (moment(input.target.value).isValid()) {
			this.filterWasApplied('date', moment(input.target.value).format('MM/DD/YYYY'));
		}
	}

	onMatchReported(formGroupDirective: FormGroupDirective, match: Match): void {
		const matchResult = { ...match.matchResult };
		matchResult.homeTeamScore = this.matchReportForm.get('homeTeamScore').value;
		matchResult.awayTeamScore = this.matchReportForm.get('awayTeamScore').value;
		formGroupDirective.resetForm();
		this.matchReported.emit({ result: matchResult, sessionID: match.sessionId });
	}

	onRowSelected(event: { status: 'expanded' | 'collapsed'; match: Match }): void {
		this.matchReportForm.reset();
		this.populateMatchResults(event.match.matchResult);
	}

	onFillInStats(): void {
		console.log('not implemented');
	}

	// #endregion

	// #region Methods

	showLeagueSelection(): boolean {
		return this.matTableHelper.showLeagueSelectionForMatTable(this.pairs);
	}

	getCurrentTitle(): string {
		return this.matTableHelper.getCurrentTitleTableLeagueSelection(this.pairs, this.selectedLeague.value);
	}

	private populateMatchResults(matchResult: MatchResult): void {
		if (matchResult) {
			this.matchReportForm.get('homeTeamScore').setValue(matchResult.homeTeamScore === 0 ? null : matchResult.homeTeamScore);
			this.matchReportForm.get('awayTeamScore').setValue(matchResult.awayTeamScore === 0 ? null : matchResult.awayTeamScore);
		}
	}

	private tableSetUp(): void {
		if (this.sort && this.paginator) {
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.dataSource.sortingDataAccessor = matchSortingFn;
		}
	}

	private initForms(): void {
		this.matchReportForm = this.fb.group({
			homeTeamScore: this.fb.control(null, Validators.required),
			awayTeamScore: this.fb.control(null, Validators.required)
		});
	}

	// #endregion
}
