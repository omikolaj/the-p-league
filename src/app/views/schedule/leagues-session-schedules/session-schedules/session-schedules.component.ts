import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { filterOnInputValue } from 'src/app/shared/helpers/filter-predicate.function';
import { matchSortingFn } from 'src/app/shared/helpers/sorting-data-accessor.function';
import { BYE_WEEK_DATE_TEXT } from '../../../../shared/constants/the-p-league-constants';

@Component({
	selector: 'app-session-schedules',
	templateUrl: './session-schedules.component.html',
	styleUrls: ['./session-schedules.component.scss']
})
export class SessionSchedulesComponent implements OnInit {
	@Input() dataSource: MatTableDataSource<Match>;
	filterValue: FormControl = this.fb.control(null);
	// TODO extract to a single location to be utiliazed by both preview component and this component
	displayedColumns: string[] = ['home', 'result', 'away', 'date'];
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	constructor(private fb: FormBuilder) {}

	ngOnInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
		this.dataSource.sortingDataAccessor = matchSortingFn;
	}

	applyFilter(filterValue: string): void {
		this.dataSource.filterPredicate = filterOnInputValue;
		this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
}
