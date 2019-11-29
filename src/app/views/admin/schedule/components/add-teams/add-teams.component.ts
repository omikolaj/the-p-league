import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material';
import { cloneDeep } from 'lodash';
import { SportTypesLeaguesPairs } from '../../models/sport-types-leagues-pairs.model';

@Component({
	selector: 'app-add-teams',
	templateUrl: './add-teams.component.html',
	styleUrls: ['./add-teams.component.scss']
})
export class AddTeamsComponent {
	title = 'Add';
	description = 'Team';
	@Input() newTeamForm: FormGroup;
	@Input() sportLeaguePairs: SportTypesLeaguesPairs[];
	@Output() onNewTeam: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	@ViewChild(MatExpansionPanel, { static: false })
	matExpansionPanel: MatExpansionPanel;

	constructor() {}

	onSubmit(formGroupDirective: FormGroupDirective): void {
		const newTeam = cloneDeep(this.newTeamForm);
		formGroupDirective.resetForm();
		this.onNewTeam.emit(newTeam);
		this.matExpansionPanel.close();
	}
}
