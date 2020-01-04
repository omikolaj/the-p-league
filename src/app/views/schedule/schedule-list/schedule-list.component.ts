import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { ScheduleFacadeService } from './../../../core/services/schedule/schedule-facade.service';

@Component({
	selector: 'app-schedule-list',
	templateUrl: './schedule-list.component.html',
	styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {
	leaguesSessionSchduleDataSource = new MatTableDataSource<Match>(this.scheduleFacade.activeSessionsMatches);

	constructor(private scheduleFacade: ScheduleFacadeService) {}

	ngOnInit() {
    console.log('initialized schedule list');
  }
}
