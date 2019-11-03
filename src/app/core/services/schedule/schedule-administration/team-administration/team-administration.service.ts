import { ScheduleAdministrationService } from './../schedule-administration.service';
import { Injectable } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { LeagueAdministrationService } from '../league-administration/league-administration.service';

@Injectable({
  providedIn: 'root'
})
export class TeamAdministrationService {
  constructor(private scheduleAdminService: ScheduleAdministrationService, private leagueAdminService: LeagueAdministrationService) {}

  updateTeams(teams: Team[]) {
    this.leagueAdminService.updateTeams(teams);
  }
}
