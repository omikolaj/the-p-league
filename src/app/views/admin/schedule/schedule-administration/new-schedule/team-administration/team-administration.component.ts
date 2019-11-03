import { EditTeamControl } from './../../../models/edit-team-control.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { TeamAdministrationService } from 'src/app/core/services/schedule/schedule-administration/team-administration/team-administration.service';

@Component({
  selector: 'app-team-administration',
  templateUrl: './team-administration.component.html',
  styleUrls: ['./team-administration.component.scss']
})
export class TeamAdministrationComponent implements OnInit {
  @Input() league: League;
  teamsForm: FormGroup;

  constructor(private teamAdminService: TeamAdministrationService, private fb: FormBuilder) {}

  ngOnInit() {
    console.log('teamadmin:', this.league);
    this.initForms();
  }

  initForms() {
    const teamNameControls = this.league.teams.map(t =>
      this.fb.group({
        id: this.fb.control(t.id),
        name: this.fb.control(t.name, Validators.required),
        readonly: this.fb.control(true),
        selected: this.fb.control(true)
      })
    );

    this.teamsForm = this.fb.group({
      teams: this.fb.array(teamNameControls),
      league: this.fb.group({
        name: this.fb.control(this.league.name),
        type: this.fb.control(this.league.type)
      })
    });
  }

  onUpdatedTeams(teams: EditTeamControl[]) {
    const updatedTeams: Team[] = [];
    for (let index = 0; index < teams.length; index++) {
      const teamControl = teams[index];
      const team: Team = {
        id: teamControl.id,
        name: teamControl.name,
        leagueID: this.league.id
      };
      updatedTeams.push(team);
    }
    this.teamAdminService.updateTeams(updatedTeams);
  }
}
