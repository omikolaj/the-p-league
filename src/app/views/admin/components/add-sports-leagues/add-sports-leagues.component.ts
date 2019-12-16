import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatExpansionPanel } from '@angular/material';
import { cloneDeep } from 'lodash';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';

/**
 * @description AddLeagueComponent is responsible for adding new sport OR league.
 * It is displayed by the schedule-administration.component
 */
@Component({
	selector: 'app-add-sports-leagues',
	templateUrl: './add-sports-leagues.component.html',
	styleUrls: ['./add-sports-leagues.component.scss']
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
