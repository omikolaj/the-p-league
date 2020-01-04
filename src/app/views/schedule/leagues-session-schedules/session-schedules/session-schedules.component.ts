import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairsWithTeams } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { matchSortingFn } from 'src/app/shared/helpers/sorting-data-accessor.function';
import { BYE_WEEK_DATE_TEXT, VIEW_ALL } from '../../../../shared/constants/the-p-league-constants';

@Component({
	selector: 'app-session-schedules',
	templateUrl: './session-schedules.component.html',
	styleUrls: ['./session-schedules.component.scss']
})
export class SessionSchedulesComponent implements OnInit {
	@Input() dataSource: MatTableDataSource<Match>;
	@Input() pairs: SportTypesLeaguesPairsWithTeams[] = [];
	@Input() set displayLeagueID(value: string) {
		this.selectedLeague.setValue(value);
	}
	@Input() set displayTeamID(value: string) {
		this.selectedTeam.setValue(value);
	}
	viewAll = VIEW_ALL;
	filterValue: FormControl = this.fb.control(null);
	selectedLeague: FormControl = this.fb.control(null);
	selectedTeam: FormControl = this.fb.control(null);
	// TODO extract to a single location to be utiliazed by both preview component and this component
	displayedColumns: string[] = ['home', 'result', 'away', 'date'];
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@Output() leagueChanged = new EventEmitter<string>();
	@Output() teamChanged = new EventEmitter<string>();

	constructor(private fb: FormBuilder, private scheduleHelper: ScheduleComponentHelperService) {}

	ngOnInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
		this.dataSource.sortingDataAccessor = matchSortingFn;
		console.log('logging pairs from session', this.pairs);
	}

	applyFilter(filterValue: string): void {
		this.scheduleHelper.applyMatTableFilterValue(filterValue, this.dataSource);
	}

	showLeagueSelection(): boolean {
		return this.scheduleHelper.showLeagueSelectionForMatTable(this.pairs);
	}

	getCurrentTitle(): string {
		return this.scheduleHelper.getCurrentTitleTableLeagueSelection(this.pairs, this.selectedLeague.value);
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
}
