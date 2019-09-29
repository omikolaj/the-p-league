import { Component, OnInit, Self } from '@angular/core';
import LeagueScheduleDataSource from './league-schedule.datasource';
import { ScheduleService } from 'src/app/core/services/schedule/schedule.service';


export enum Side{
  Home = 0,
  Away = 1
}

@Component({
  selector: 'app-league-schedule',
  templateUrl: './league-schedule.component.html',
  styleUrls: ['./league-schedule.component.scss'],
  providers: [ScheduleService]
})
export class LeagueScheduleComponent implements OnInit {
  displayedColumns: string[] = ["home", "away", "date"];
  dataSource: LeagueScheduleDataSource;
  Side = Side;
  constructor(@Self() public scheduleService: ScheduleService) { }

  ngOnInit() {
    this.dataSource = new LeagueScheduleDataSource(this.scheduleService);
    this.dataSource.loadSchedule();
  }

}
