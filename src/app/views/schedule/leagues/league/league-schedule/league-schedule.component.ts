import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-league-schedule',
	templateUrl: './league-schedule.component.html',
	styleUrls: ['./league-schedule.component.scss']
})
export class LeagueScheduleComponent implements OnInit {
	displayedColumns: string[] = ['home', 'away', 'date'];

	constructor() {}

	ngOnInit(): void {}
}
