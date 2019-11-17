import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';

import { TabTitles } from '../../models/tab-titles.model';
import { Observable, pairs } from 'rxjs';
import { AbstractControlOptions, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { SportTypesLeaguesPairs } from '../../models/sport-types-leagues-pairs.model';

@Component({
  selector: 'app-new-schedule',
  templateUrl: './new-schedule.component.html',
  styleUrls: ['./new-schedule.component.scss']
})
export class NewScheduleComponent implements OnInit {
  tab: TabTitles = 'New Schedule';
  assignTeamsForm: FormGroup;
  leagues$: Observable<League[]> = this.scheduleAdminFacade.selectedLeagues$;
  unassignedTeams$: Observable<Team[]>;
  sportLeaguePairs$: Observable<SportTypesLeaguesPairs[]> = this.scheduleAdminFacade.sportTypesLeaguesPairs$;

  constructor(private scheduleAdminFacade: ScheduleAdministrationFacade, private fb: FormBuilder) {}

  ngOnInit() {
    this.unassignedTeams$ = this.scheduleAdminFacade.unassignedTeams$.pipe(
      map(teams => {
        this.initForms(teams);
        return teams;
      })
    );
  }

  initForms(teams: Team[]) {
    this.initAssignTeamsForm(teams);
  }

  initAssignTeamsForm(teams: Team[]) {
    const assignTeamControls = [];
    teams.forEach(t => {
      assignTeamControls.push(
        this.fb.group({
          teamName: this.fb.control(t.name),
          leagueID: this.fb.control(null)
        })
      );
    });

    this.assignTeamsForm = this.fb.group({
      unassignedTeams: this.fb.array(assignTeamControls)
    });
  }

  onAssignTeams(assignedTeamsForm: FormGroup) {
    console.log('assignedTeamForm', assignedTeamsForm);
  }
}
