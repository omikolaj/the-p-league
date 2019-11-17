import { EditTeamControl } from './../../../models/edit-team-control.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { TeamAdministrationService } from 'src/app/core/services/schedule/schedule-administration/team-administration/team-administration.service';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { Observable } from 'rxjs';
import { TeamState } from 'src/app/store/state/team.state';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/operators';
import { MatSelectionListChange } from '@angular/material/list';
import { ScheduleHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-helper.service';

@Component({
  selector: 'app-team-administration',
  templateUrl: './team-administration.component.html',
  styleUrls: ['./team-administration.component.scss']
})
export class TeamAdministrationComponent implements OnInit {
  @Input() league: League;
  teams$: Observable<Team[]>;
  teams: Team[];
  teamsForm: FormGroup;

  constructor(private scheduleAdminFacade: ScheduleAdministrationFacade, private fb: FormBuilder, private scheduleHelper: ScheduleHelperService) {}

  ngOnInit() {
    this.teams$ = this.scheduleAdminFacade.store.select(TeamState.getAllTeamsForLeagueID).pipe(
      map(filterFn => filterFn(this.league.id)),
      tap(teams => {
        this.initForms(teams);
        this.teams = teams;
      })
    );
  }

  initForms(teams: Team[]) {
    const teamNameControls = teams.map(t =>
      this.fb.group({
        id: this.fb.control(t.id),
        name: this.fb.control(t.name, Validators.required)
      })
    );

    this.teamsForm = this.fb.group({
      teams: this.fb.array(teamNameControls)
    });
  }

  //#region Event Handlers

  onDeletedTeamsHandler() {
    this.scheduleAdminFacade.deleteTeams(this.league.id);
  }

  onUnassignHandler() {
    this.scheduleAdminFacade.unassignTeams(this.league.id);
  }

  //TODO refactor into helper method same logic as in league-administration.component onUpdatedLeagues
  onUpdatedTeams(updatedTeams: FormGroup) {
    this.teams$.pipe(map(teams => console.log('inside teams$ pipe', teams)));
    const teamsToUpdate: Team[] = [];
    const teamsFormArray = updatedTeams.get('teams') as FormArray;
    for (let index = 0; index < teamsFormArray.length; index++) {
      const currentTeam = teamsFormArray.at(index);
      if (!this.teams.find(t => t.name === currentTeam.value.name)) {
        const existingTeam = this.teams.find(t => t.id === currentTeam.value.id);
        const teamToUpdate: Team = {
          id: existingTeam.id,
          name: currentTeam.value.name,
          leagueID: existingTeam.leagueID,
          selected: existingTeam.selected
        };
        teamsToUpdate.push(teamToUpdate);
      }
    }
    this.scheduleAdminFacade.updateTeams(teamsToUpdate);
  }

  onSelectedTeamsChangeHandler(selectedTeamsEvent: MatSelectionListChange) {
    const ids: string[] = this.scheduleHelper.onSelectionChange(selectedTeamsEvent);
    this.scheduleAdminFacade.updateTeamSelection(ids, this.league.id);
  }

  //#endregion
}
