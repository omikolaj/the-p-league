import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { TabTitles } from '../../models/tab-titles.model';
import { Observable, combineLatest, forkJoin, zip } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { map, tap, filter, flatMap, concatMap, mergeMap, switchMap } from 'rxjs/operators';
import { UNASSIGNED } from 'src/app/helpers/Constants/ThePLeagueConstants';
import { MatSelectionListChange } from '@angular/material';
import { ScheduleHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-helper.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

@Component({
  selector: 'app-new-schedule',
  templateUrl: './new-schedule.component.html',
  styleUrls: ['./new-schedule.component.scss'],
  providers: [ScheduleHelperService],
  // TODO test this to ensure its not causing unexpected behavior
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewScheduleComponent implements OnInit {
  tab: TabTitles = 'New Schedule';
  assignTeamsForm: FormGroup;
  selectedTeamIDs: string[] = [];

  leagues$: Observable<{ league: League; teams: Team[] }[]> = combineLatest([
    this.scheduleAdminFacade.selectedLeagues$,
    this.scheduleAdminFacade.getAllForLeagueID$
  ]).pipe(
    map(([selectedLeagues, filterFn]) => {
      return selectedLeagues.map(l => {
        return { league: l, teams: filterFn(l.id), form: this.initEditTeamsForm(filterFn(l.id)) };
      });
    })
  );

  unassignedTeamsData$ = combineLatest(this.scheduleAdminFacade.unassignedTeams$, this.scheduleAdminFacade.sportTypesLeaguesPairs$).pipe(
    tap(([unassignedTeams]) => this.initAssignTeamsForm(unassignedTeams)),
    map(([unassignedTeams, pairs]) => {
      return { pairs, unassignedTeams };
    })
  );

  constructor(private scheduleAdminFacade: ScheduleAdministrationFacade, private scheduleHelper: ScheduleHelperService, private fb: FormBuilder) {}

  ngOnInit() {}

  //#region Init Forms

  /**
   * @param  {Team[]} unassignedTeams
   * Initializes form for the unassigned-teams component
   */
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

  /**
   * @param  {Team[]} teams
   * @returns FormGroup
   * Since we need to compose a separate edit team form for each
   * league, we have to return a form group here and wrap it
   * inside an observable (the wrapping of the observable occurs in the leagues$ pipe),
   * it is then unwrapped and passed down
   * to the edit-teams-list component in the template
   */
  initEditTeamsForm(teams: Team[]): FormGroup {
    const teamNameControls = teams.map(t =>
      this.fb.group({
        id: this.fb.control(t.id),
        name: this.fb.control(t.name, Validators.required)
      })
    );

    return this.fb.group({
      teams: this.fb.array(teamNameControls)
    });
  }

  //#endregion

  //#region Event Handlers

  /**
   * @param  {FormGroup} assignedTeamsForm
   * Fired whenever user assigns teams to a league.
   * Creating shell team object to carry the team ID and the league the team should be assigned to
   * instead of creating a separate object to carry this information
   */
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

  onTeamsSelectionChangeHandler(selectedTeamsEvent: MatSelectionListChange) {
    this.selectedTeamIDs = this.scheduleHelper.onSelectionChange(selectedTeamsEvent);
  }

  onUnassignTeamsHandler(leagueID: string) {
    this.scheduleAdminFacade.unassignTeams(leagueID, this.selectedTeamIDs);
  }

  onDeleteTeamsHandler(leagueID: string) {
    this.scheduleAdminFacade.deleteTeams(leagueID, this.selectedTeamIDs);
  }

  //#endregion
}
