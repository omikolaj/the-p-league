import { Component, OnInit } from '@angular/core';
import { ScheduleAdministrationService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { LeagueAdministrationService } from 'src/app/core/services/schedule/schedule-administration/league-administration/league-administration.service';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';

@Component({
  selector: 'app-new-schedule',
  templateUrl: './new-schedule.component.html',
  styleUrls: ['./new-schedule.component.scss']
})
export class NewScheduleComponent implements OnInit {
  leagues: League[];
  unassignedTeams: Team[];

  constructor(private leagueAdminService: LeagueAdministrationService) { }

  ngOnInit() {
    this.leagues = this.leagueAdminService.allSelectedLeagues;
    this.unassignedTeams = this.leagueAdminService.unassignedTeams;
    console.log("unassigned leagues", this.unassignedTeams);
  }

}
