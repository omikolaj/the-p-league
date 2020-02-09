import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { Team } from 'src/app/core/models/schedule/team.model';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
	selector: 'app-add-teams',
	templateUrl: './add-teams.component.html',
	styleUrls: ['./add-teams.component.scss']
})
export class AddTeamsComponent {
	title = 'Team';
	active = undefined;
	@Input() newTeamForm: FormGroup;
	private _pairs: SportTypesLeaguesPairs[] = [];
	get sportLeaguePairs(): SportTypesLeaguesPairs[] {
		return this._pairs;
	}
	@Input() set sportLeaguePairs(value: SportTypesLeaguesPairs[]) {
		// filter out any sport types that have leagues empty array
		this._pairs = value.filter((p) => p.leagues.length !== 0);
	}
	@Output() onNewTeam: EventEmitter<Team> = new EventEmitter<Team>();
	@ViewChild(MatExpansionPanel)
	matExpansionPanel: MatExpansionPanel;

	constructor() {}

	onSubmit(formGroupDirective: FormGroupDirective): void {
		const newTeam: Team = {
			leagueID: this.newTeamForm.get('leagueID').value,
			name: this.newTeamForm.get('name').value,
			selected: true
		};
		this.onNewTeam.emit(newTeam);
		this.matExpansionPanel.close();
		formGroupDirective.resetForm();
		this.active = undefined;
	}
}
