import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { LeagueService } from 'src/app/core/services/schedule/schedule-administration/league/league.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';

@Component({
  selector: 'app-unassigned',
  templateUrl: './unassigned.component.html',
  styleUrls: ['./unassigned.component.scss']
})
export class UnassignedComponent implements OnInit {
  @Input('teams') unassignedTeams: Team[];
  leagues: League[] = [];
  sports: SportType[];

  constructor(private leagueAdminService: LeagueService, private scheduleAdminFacade: ScheduleAdministrationFacade) {}

  ngOnInit() {
    // this.sports = this.leagueAdminService.sportTypes;
    // this.leagues = this.leagueAdminService.leagues;
    // console.log("unassigned teams");
  }
}
