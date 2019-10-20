import { Component, OnInit, Self } from '@angular/core';
import LeagueScheduleDataSource from './league-schedule.datasource';
import { DateTimeRanges } from '../../../models/interfaces/match-time-ranges.model';
import { MatchDay } from '../../../models/match-days.enum';
import * as moment from 'moment';
import { SessionScheduleService } from 'src/app/core/services/schedule/session-schedule/session-schedule.service';
import { League } from '../../../models/interfaces/League.model';
import { Sport } from '../../../models/sport.enum';
import { TEAMS } from '../../../models/interfaces/team.model';
import SessionSchedule from 'src/app/core/services/schedule/models/session-schedule.model';

export enum Side{
  Home = 0,
  Away = 1
}

@Component({
  selector: 'app-league-schedule',
  templateUrl: './league-schedule.component.html',
  styleUrls: ['./league-schedule.component.scss'],
  providers: [ SessionScheduleService ]
})
export class LeagueScheduleComponent implements OnInit {
  displayedColumns: string[] = ["home", "away", "date"];
  dataSource: LeagueScheduleDataSource;
  Side = Side;  

  constructor(@Self() public scheduleService: SessionScheduleService) { }

  ngOnInit() {
    const dateTimeRanges: DateTimeRanges = {
			timesOfDays: [
				{
					[MatchDay[MatchDay.Tuesday]]: [
						{ hour: 20, minute: 0o0 },
						{ hour: 21, minute: 0o0 },
						{ hour: 22, minute: 0o0 }
					]
				}
			],
			days: [
				MatchDay.Tuesday
			],
			session: {
				startDate: moment(new Date("9-3-2019")),
				endDate: moment(new Date("11-22-2019"))
			}
    }

		const basketBall: League = { type: { name: "Basketball" } }
    const sessionSchedule: SessionSchedule  = new SessionSchedule(TEAMS, dateTimeRanges, basketBall)

    this.dataSource = new LeagueScheduleDataSource(this.scheduleService);
    this.dataSource.createSchedule(sessionSchedule);
  }

}