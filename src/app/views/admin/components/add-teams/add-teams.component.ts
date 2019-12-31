import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material';
import { cloneDeep } from 'lodash';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';

@Component({
	selector: 'app-add-teams',
	templateUrl: './add-teams.component.html',
	styleUrls: ['./add-teams.component.scss']
})
export class AddTeamsComponent {
	title = 'Add';
	description = 'Team';
	@Input() newTeamForm: FormGroup;
	private _pairs: SportTypesLeaguesPairs[] = [];
	get sportLeaguePairs(): SportTypesLeaguesPairs[] {
		return this._pairs;
	}
	@Input() set sportLeaguePairs(value: SportTypesLeaguesPairs[]) {
		// filter out any sport types that have leagues empty array
		this._pairs = value.filter((p) => p.leagues.length !== 0);
	}
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
