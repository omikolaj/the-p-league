import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { Team } from 'src/app/core/models/schedule/team.model';

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
	get assignTeamsForm(): FormGroup {
		return this._assignTeamsForm;
	}
	teams: Team[] = [];

	constructor() {}

	ngOnInit(): void {}

	onSubmit(): void {
		this.onAssignTeamsToLeagues.emit(this.assignTeamsForm);
	}
}
