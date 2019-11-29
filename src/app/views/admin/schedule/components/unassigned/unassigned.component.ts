import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { SportTypesLeaguesPairs } from '../../models/sport-types-leagues-pairs.model';

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
