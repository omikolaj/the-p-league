import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { SportTypesLeaguesPairs } from '../../models/sport-types-leagues-pairs.model';
import { FormGroup, FormGroupDirective, FormArray } from '@angular/forms';
import { UNASSIGNED } from 'src/app/helpers/Constants/ThePLeagueConstants';

@Component({
  selector: 'app-unassigned',
  templateUrl: './unassigned.component.html',
  styleUrls: ['./unassigned.component.scss']
})
export class UnassignedComponent implements OnInit {
  @Output() onAssignTeamsToLeagues: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() sportLeaguePairs: SportTypesLeaguesPairs[];
  private _assignTeamsForm: FormGroup;
  @Input()
  set assignTeamsForm(form) {
    this.teams = form.get('unassignedTeams').value;
    this._assignTeamsForm = form;
  }
  get assignTeamsForm() {
    return this._assignTeamsForm;
  }
  teams: Team[] = [];

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    this.onAssignTeamsToLeagues.emit(this.assignTeamsForm);
  }
}
