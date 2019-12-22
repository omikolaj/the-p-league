import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { BYE_WEEK_DATE_TEXT, VIEW_ALL } from 'src/app/shared/helpers/constants/the-p-league-constants';
import { filterOnInputValue, filterOnLeagueID } from './filter-predicate.function';
import { previewMatchSortingFn } from './sorting-data-accessor.function';

@Component({
	selector: 'app-preview-schedule',
	templateUrl: './preview-schedule.component.html',
	styleUrls: ['./preview-schedule.component.scss']
})
export class PreviewScheduleComponent implements OnInit, AfterViewInit {
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;
	viewAll = VIEW_ALL;

	/**
	 * @description Determines the order in which the columns are displayed
	 * The names in this list have to match the names in the template.
	 * The order in which these names are given, will be the order of columns
	 * rendered in the UI
	 */
	displayedColumns: string[] = ['home', 'away', 'date'];
	selectedLeague: FormControl = this.fb.control(null);
	filterValue: FormControl = this.fb.control(null);
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@Input() matchesDataSource: MatTableDataSource<Match>;
	@Input() pairs: SportTypesLeaguesPairs[] = [];
	@Input() set displayLeagueID(value: string) {
		console.log('incoming value', value);
		this.selectedLeague.setValue(value);
	}
	showForMultipleLeagues = false;
	@Output() leagueChanged = new EventEmitter<string>();

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		// determines whether we should display the league selection drop down to the user
		// or not.
		if (this.pairs.length > 0 && this.pairs.length === 1) {
			if (this.pairs[0].leagues.length > 1) {
				this.showForMultipleLeagues = true;
			}
		} else {
			this.showForMultipleLeagues = true;
		}
	}

	ngAfterViewInit(): void {
		this.matchesDataSource.sort = this.sort;
		this.matchesDataSource.paginator = this.paginator;
		this.matchesDataSource.sortingDataAccessor = previewMatchSortingFn;
	}

	onRowClicked(row: Match): void {
		console.log('row was clicked', row);
		// this.test.dispatch(new DeleteMatch(row));
	}

	onSelectionChange(): void {
		this.filterValue.setValue('');
		this.matchesDataSource.filterPredicate = filterOnLeagueID;
		this.leagueChanged.emit(this.selectedLeague.value);
	}

	applyFilter(filterValue: string): void {
		this.matchesDataSource.filterPredicate = filterOnInputValue;
		this.matchesDataSource.filter = filterValue.trim().toLowerCase();
		if (this.matchesDataSource.paginator) {
			this.matchesDataSource.paginator.firstPage();
		}
	}
}
