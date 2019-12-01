import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatExpansionPanel } from '@angular/material';
import { cloneDeep } from 'lodash';
import { SportTypesLeaguesPairs } from '../../models/sport-types-leagues-pairs.model';

@Component({
	selector: 'app-add-leagues',
	templateUrl: './add-leagues.component.html',
	styleUrls: ['./add-leagues.component.scss']
})
export class AddLeaguesComponent {
	title = 'Add';
	description = 'Sport/League';
	@Input() newSportLeagueForm: FormGroup;
	@Input() sportLeaguePairs: SportTypesLeaguesPairs[];
	@Output() onNewSportLeague: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	@ViewChild(MatExpansionPanel, { static: false })
	matExpansionPanel: MatExpansionPanel;

	constructor() {}

	onSubmit(formGroupDirective: FormGroupDirective): void {
		const newSportLeague = cloneDeep(this.newSportLeagueForm);
		// Necessary to reset validations
		formGroupDirective.resetForm();

		this.onNewSportLeague.emit(newSportLeague);
		// Collapse the expansion panel
		this.matExpansionPanel.close();
	}

	onSportSelectionChange(event: MatAutocompleteSelectedEvent): void {
		if (event) {
			if (event.option.id) {
				this.newSportLeagueForm.get('sportTypeID').setValue(event.option.id);
			}
		}
	}
}
