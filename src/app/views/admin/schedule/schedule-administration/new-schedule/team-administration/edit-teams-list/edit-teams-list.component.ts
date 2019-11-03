import { EditTeamControl } from './../../../../models/edit-team-control.model';
import { MatSelectionListChange } from '@angular/material';
import { SportType } from './../../../../../../schedule/models/interfaces/sport-type.model';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';

@Component({
  selector: 'app-edit-teams-list',
  templateUrl: './edit-teams-list.component.html',
  styleUrls: ['./edit-teams-list.component.scss']
})
export class EditTeamsListComponent implements OnInit {
  @Input() teamsForm: FormGroup;
  @Output() unassignedTeams: EventEmitter<Team[]> = new EventEmitter<Team[]>();
  @Output() updatedTeams: EventEmitter<Team[]> = new EventEmitter<Team[]>();
  @Output() deletedTeams: EventEmitter<Team[]> = new EventEmitter<Team[]>();
  @Output() selectedTeamsChange: EventEmitter<EditTeamControl[]> = new EventEmitter<EditTeamControl[]>();

  teams: EditTeamControl[] = [];
  leagueName: string;
  leagueType: string;
  disableListSelection: boolean = false;
  numberOfSelectedTeams: number;

  constructor() {}

  //#region ng LifeCycle Hooks

  ngOnInit() {
    const leagueControl = this.teamsForm.get('league');
    this.leagueName = leagueControl.get('name').value;
    this.leagueType = (leagueControl.get('type').value as SportType).name;
    this.teams = this.teamsForm.get('teams').value;
  }

  //#endregion

  onSelectionChange(event: MatSelectionListChange) {
    this.numberOfSelectedTeams = event.source.selectedOptions.selected.length;

    const selectedTeamControls: EditTeamControl[] = [];
    for (let index = 0; index < this.numberOfSelectedTeams; index++) {
      const id = event.source.selectedOptions.selected[index].value;
      selectedTeamControls.push(this.teams.find(t => t.id === id));
    }
    this.selectedTeamsChange.emit(selectedTeamControls);
  }

  onSubmit() {
    this.disableListSelection ? this.onSaveHandler() : this.onEditHandler();
  }

  onUnassignHandler() {}

  onEditHandler() {
    this.disableListSelection = !this.disableListSelection;
  }

  onSaveHandler() {
    this.disableListSelection = !this.disableListSelection;

    const updatedTeamControls: EditTeamControl[] = [];
    const updatedControls = this.teamsForm.get('teams').value;
    for (let index = 0; index < updatedControls.length; index++) {
      const updatedTeamControl = updatedControls[index] as EditTeamControl;
      updatedTeamControls.push(updatedTeamControl);
    }

    this.updatedTeams.emit(updatedTeamControls);
  }
}
