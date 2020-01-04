import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';

@Component({
	selector: 'app-leagues-session-schedules',
	templateUrl: './leagues-session-schedules.component.html',
	styleUrls: ['./leagues-session-schedules.component.scss']
})
export class LeaguesSessionSchedulesComponent implements OnInit {
	@Input() schedulesDataSource: MatTableDataSource<LeagueSessionSchedule>;

	constructor() {}

	ngOnInit() {}
}
