import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { LeagueAdministrationService } from 'src/app/core/services/schedule/schedule-administration/league-administration/league-administration.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration.service';

@Component({
  selector: 'app-unassigned',
  templateUrl: './unassigned.component.html',
  styleUrls: ['./unassigned.component.scss']
})
export class UnassignedComponent implements OnInit {
  @Input('teams') unassignedTeams: Team[];
  leagues: League[] = [];
  sports: SportType[];

  constructor(private leagueAdminService: LeagueAdministrationService, private scheduleAdminService: ScheduleAdministrationService) {}

  ngOnInit() {
    // this.sports = this.leagueAdminService.sportTypes;
    // this.leagues = this.leagueAdminService.leagues;
    // console.log("unassigned teams");
  }
}
