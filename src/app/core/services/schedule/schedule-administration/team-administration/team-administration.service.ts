import { ScheduleAdministrationFacade } from '../schedule-administration-facade.service';
import { Injectable } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { LeagueService } from '../league/league.service';

@Injectable({
	providedIn: 'root'
})
export class TeamAdministrationService {
	constructor(private scheduleAdminFacade: ScheduleAdministrationFacade, private leagueAdminService: LeagueService) {}

	updateTeams(teams: Team[]) {
		this.leagueAdminService.updateTeams(teams);
	}
}
