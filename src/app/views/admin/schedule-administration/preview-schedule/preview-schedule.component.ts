import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { BYE_WEEK_DATE_TEXT, VIEW_ALL } from 'src/app/shared/constants/the-p-league-constants';
import { filterOnInputValue, filterOnLeagueID } from '../../../../shared/helpers/filter-predicate.function';
import { matchSortingFn } from '../../../../shared/helpers/sorting-data-accessor.function';

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

	constructor(private fb: FormBuilder, private scheduleHelper: ScheduleComponentHelperService) {}

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
		// find title for the currently selected league id
		const leagueID: string = this.selectedLeague.value;
		const pairs = this.scheduleHelper.filterPairsForGeneratedSessions(this.pairs, [leagueID]);
		let title = '';
		if (pairs) {
			if (pairs.length > 0) {
				const pair = pairs[0];
				title = `${pair.name} - `;
				if (pair.leagues) {
					if (pair.leagues.length > 0) {
						title += `${pair.leagues[0].name}`;
					}
				}
			}
		}
		return title === '' ? 'All' : title;
	}

	/**
	 * @description Used in the view to determine if the select drop down list
	 * for leagues should be visible or not. If its just a single league we
	 * do not care to show it
	 * @returns true if league selection
	 */
	showLeagueSelection(): boolean {
		if (this.pairs.length > 0 && this.pairs.length === 1) {
			if (this.pairs[0].leagues.length > 1) {
				return true;
			}
		} else {
			return true;
		}
	}

	applyFilter(filterValue: string): void {
		this.matchesDataSource.filterPredicate = filterOnInputValue;
		this.matchesDataSource.filter = filterValue.trim().toLowerCase();
		if (this.matchesDataSource.paginator) {
			this.matchesDataSource.paginator.firstPage();
		}
	}

	// #endregion

	// #endregion Event Handlers

	onPublishedSchedules(): void {
		this.schedulesPublished.emit();
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

	// #endregion
}
