import { Component, OnInit } from '@angular/core';
import { BYE_WEEK_DATE_TEXT } from 'src/app/helpers/Constants/ThePLeagueConstants';
import { LeaguesSchedulesDataSourceService } from 'src/app/shared/services/leagues-schedules-data-source.service';

@Component({
	selector: 'app-preview-schedule',
	templateUrl: './preview-schedule.component.html',
	styleUrls: ['./preview-schedule.component.scss']
})
export class PreviewScheduleComponent implements OnInit {
	byeWeekOptionalDateText = BYE_WEEK_DATE_TEXT;
	displayedColumns: string[] = ['home', 'away', 'date'];

	constructor(public previewScheduleDataSource: LeaguesSchedulesDataSourceService) {}

	ngOnInit() {
		console.log('inside preview schedule ngOnInit');
	}
}
