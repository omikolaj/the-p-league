import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';
import { BYE_WEEK_DATE_TEXT } from './../../../../shared/helpers/constants/the-p-league-constants';

@Component({
	selector: 'app-session-schedules',
	templateUrl: './session-schedules.component.html',
	styleUrls: ['./session-schedules.component.scss']
})
export class SessionSchedulesComponent implements OnInit {
	@Input() dataSource: MatTableDataSource<LeagueSessionSchedule>;
	// TODO extract to a single location to be utiliazed by both preview component and this component
	displayedColumns: string[] = ['home', 'result', 'away', 'date'];
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;
	constructor() {}

	ngOnInit() {
		console.log('initialized session schedules');
	}
}
