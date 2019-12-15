import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { BYE_WEEK_DATE_TEXT } from 'src/app/helpers/Constants/ThePLeagueConstants';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { SportTypesLeaguesPairs } from './../../models/sport-types-leagues-pairs.model';

@Component({
	selector: 'app-preview-schedule',
	templateUrl: './preview-schedule.component.html',
	styleUrls: ['./preview-schedule.component.scss']
})
export class PreviewScheduleComponent implements OnInit {
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;

	/**
	 * @description Determines the order in which the columns are displayed
	 * The names in this list have to match the names in the template.
	 * The order in which these names are given, will be the order of columns
	 * rendered in the UI
	 */
	displayedColumns: string[] = ['home', 'away', 'date'];
	selectedLeague: FormControl = this.fb.control(null);
	@Input() matchesDataSource: MatTableDataSource<Match>;
	@Input() pairs: SportTypesLeaguesPairs[] = [];
	@Input() set displayLeagueID(value: string) {
		this.selectedLeague.setValue(value);
	}
	@Output() leagueChanged = new EventEmitter<string>();

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {}

	onRowClicked(row: Match): void {
		console.log('row was clicked', row);
	}

	onSelectionChange(): void {
		this.leagueChanged.emit(this.selectedLeague.value);
	}
}
