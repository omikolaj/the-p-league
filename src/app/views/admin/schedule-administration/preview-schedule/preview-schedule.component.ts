import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { BYE_WEEK_DATE_TEXT, VIEW_ALL } from 'src/app/shared/constants/the-p-league-constants';
import { matchSortingFn } from '../../../../shared/helpers/sorting-data-accessor.function';
import { MatTableComponentHelperService } from './../../../../core/services/schedule/mat-table-component-helper.service';

@Component({
	selector: 'app-preview-schedule',
	templateUrl: './preview-schedule.component.html',
	styleUrls: ['./preview-schedule.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewScheduleComponent implements AfterViewInit {
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
		this.selectedLeague.setValue(value);
	}
	@Output() leagueChanged = new EventEmitter<string>();
	@Output() schedulesPublished = new EventEmitter<void>();

	constructor(private fb: FormBuilder, private matTableHelper: MatTableComponentHelperService) {}

	// #region Life Cycle methods

	ngAfterViewInit(): void {
		this.matchesDataSource.sort = this.sort;
		this.matchesDataSource.paginator = this.paginator;
		this.matchesDataSource.sortingDataAccessor = matchSortingFn;
	}

	// #endregion

	// #region View methods

	/**
	 * @description Gets current display title based on the currently selected league id.
	 * If the leagueID is set to 0, it will return 'All'
	 * otherwise it will return the Sport - League combo for whatever
	 * the league id is.
	 * @returns current title
	 */
	getCurrentTitle(): string {
		return this.matTableHelper.getCurrentTitleTableLeagueSelection(this.pairs, this.selectedLeague.value);
	}

	/**
	 * @description Used in the view to determine if the select drop down list
	 * for leagues should be visible or not. If its just a single league we
	 * do not care to show it
	 * @returns true if league selection
	 */
	showLeagueSelection(): boolean {
		return this.matTableHelper.showLeagueSelectionForMatTable(this.pairs);
	}

	applyFilter(filterValue: string): void {
		this.matTableHelper.applyMatTableFilterValue(filterValue, this.matchesDataSource);
	}

	// #endregion

	// #endregion Event Handlers

	onPublishedSchedules(): void {
		this.schedulesPublished.emit();
	}

	onSelectionChange(): void {
		this.matTableHelper.applyMatTableLeagueSelectionFilter(this.matchesDataSource);
		this.filterValue.setValue('');
		this.leagueChanged.emit(this.selectedLeague.value);
	}

	// #endregion
}
