import { TeamState } from 'src/app/store/state/team.state';
import { TeamStateModel } from './../../../../../store/state/team.state';
import { Component, OnInit } from '@angular/core';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';

import { TabTitles } from '../../models/tab-titles.model';
import { Observable, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { map, tap, filter, switchMap } from 'rxjs/operators';
import { UNASSIGNED } from 'src/app/helpers/Constants/ThePLeagueConstants';
import { MatSelectionListChange } from '@angular/material';
import { ScheduleHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-helper.service';

@Component({
  selector: 'app-new-schedule',
  templateUrl: './new-schedule.component.html',
  styleUrls: ['./new-schedule.component.scss'],
  providers: [ScheduleHelperService]
})
export class NewScheduleComponent implements OnInit {
  tab: TabTitles = 'New Schedule';
  assignTeamsForm: FormGroup;
  teamsForm: FormGroup;

  leagues$: Observable<League[]> = this.scheduleAdminFacade.selectedLeagues$.pipe(
    tap(leagues => {
      leagues.forEach(l => {
        const teamsForLeague = this.scheduleAdminFacade.store.selectSnapshot(TeamState.getTeamsForLeagueID(l.id));
        console.log('what is l.id', l.id);
        console.log('what is teamsForLeague', teamsForLeague);
        // if teams is undefined return empty array
        this.initEditTeamsForm(teamsForLeague || []);
      });
    })
  );
  unassignedTeamsData$ = combineLatest(this.scheduleAdminFacade.unassignedTeams$, this.scheduleAdminFacade.sportTypesLeaguesPairs$).pipe(
    map(([unassignedTeams, pairs]) => {
      return {
        unassignedTeams: unassignedTeams,
        // pairs are required for unassigned-teams component to display
        // all available sports and leagues to which you can assign a team to
        pairs: pairs
      };
    }),
    filter(data => data.unassignedTeams === []),
    tap(data => {
      this.initAssignTeamsForm(data.unassignedTeams);
    })
  );

  /**
   * @param  {string} leagueID
   * @returns Observable
   * Exposes a stream of teams for the given league ID
   */
  getTeamsForLeagueID(leagueID: string): Observable<Team[]> {
    // the store only gets quiried once, and then whenever value has changed
    return this.scheduleAdminFacade.getTeamsForLeagueID(leagueID);
  }

  constructor(private scheduleAdminFacade: ScheduleAdministrationFacade, private scheduleHelper: ScheduleHelperService, private fb: FormBuilder) {}

  ngOnInit() {}

  //#region Init Forms

  initAssignTeamsForm(unassignedTeams: Team[]) {
    const assignTeamControls = [];
    unassignedTeams.forEach(t => {
      assignTeamControls.push(
        this.fb.group({
          teamName: this.fb.control(t.name),
          teamID: this.fb.control(t.id),
          leagueID: this.fb.control(UNASSIGNED)
        })
      );
    });

    this.assignTeamsForm = this.fb.group({
      unassignedTeams: this.fb.array(assignTeamControls)
    });
  }

  initEditTeamsForm(teams: Team[]) {
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

  //#endregion

  //#region Event Handlers

  onAssignTeams(assignedTeamsForm: FormGroup) {
    const formControls = [...assignedTeamsForm.get('unassignedTeams')['controls']];
    const teamsToAssign: Team[] = [];
    for (let index = 0; index < formControls.length; index++) {
      const control: FormGroup = formControls[index];
      if (control.value.leagueID !== UNASSIGNED) {
        teamsToAssign.push({
          id: control.value.teamID,
          leagueID: control.value.leagueID
        });
      }
    }
    this.scheduleAdminFacade.assignTeams(teamsToAssign);
  }

  /**
   * @param  {FormGroup} updatedTeams
   * Fired whenever user updates team names in the edit-teams-list component
   */
  onUpdateTeamsHandler(updatedTeamNames: FormGroup) {
    const teamsToUpdate: Team[] = [];
    const teamsFormArray = updatedTeamNames.get('teams') as FormArray;
    for (let index = 0; index < teamsFormArray.length; index++) {
      const currentTeam = teamsFormArray.at(index);
      teamsToUpdate.push({
        id: currentTeam.value.id,
        name: currentTeam.value.name
      });
    }
    this.scheduleAdminFacade.updateTeams(teamsToUpdate);
  }

  onTeamsSelectionChangeHandler(selectedTeamsEvent: MatSelectionListChange, leagueID: string) {
    const ids: string[] = this.scheduleHelper.onSelectionChange(selectedTeamsEvent);
    this.scheduleAdminFacade.updateTeamSelection(ids, leagueID);
  }

  onUnassignTeamsHandler(leagueID: string) {
    this.scheduleAdminFacade.unassignTeams(leagueID);
  }

  onDeleteTeamsHandler(leagueID: string) {
    this.scheduleAdminFacade.deleteTeams(leagueID);
  }

  //#endregion
}
