import { cloneDeep } from 'lodash';
import { FormGroup, Form, FormGroupDirective } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { MatExpansionPanel } from '@angular/material';
import { SportTypesLeaguesPairs } from '../../models/sport-types-leagues-pairs.model';

@Component({
  selector: 'app-add-teams',
  templateUrl: './add-teams.component.html',
  styleUrls: ['./add-teams.component.scss']
})
export class AddTeamsComponent {
  title: string = 'Add';
  description: string = 'Team';
  @Input() newTeamForm: FormGroup;
  @Input() sportLeaguePairs: SportTypesLeaguesPairs[];
  @Output() onNewTeam: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @ViewChild(MatExpansionPanel, { static: false })
  matExpansionPanel: MatExpansionPanel;

  constructor() {}

  onSubmit(formGroupDirective: FormGroupDirective) {
    const newTeam = cloneDeep(this.newTeamForm);
    formGroupDirective.resetForm();
    this.onNewTeam.emit(newTeam);
    this.matExpansionPanel.close();
  }
}
