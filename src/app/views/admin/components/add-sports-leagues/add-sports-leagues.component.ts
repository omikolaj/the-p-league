import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
	title = 'Sport/League';
	@Input() newSportLeagueForm: FormGroup;
	@Input() sportLeaguePairs: SportTypesLeaguesPairs[];
	@Output() onNewSportLeague: EventEmitter<{ sportType: string; leagueName: string; sportTypeID: string }> = new EventEmitter<{
		sportType: string;
		leagueName: string;
		sportTypeID: string;
	}>();
	@ViewChild(MatExpansionPanel)
	matExpansionPanel: MatExpansionPanel;

	constructor() {}

	onSubmit(formGroupDirective: FormGroupDirective): void {
		const newSportLeague: { sportType: string; leagueName: string; sportTypeID: string } = {
			sportType: this.newSportLeagueForm.get('sportType').value,
			leagueName: this.newSportLeagueForm.get('leagueName').value,
			sportTypeID: this.newSportLeagueForm.get('sportTypeID').value
		};

		this.onNewSportLeague.emit(newSportLeague);

		// Collapse the expansion panel
		this.matExpansionPanel.close();
		// Necessary to reset validations
		formGroupDirective.resetForm();
	}

	onSportSelectionChange(event: MatAutocompleteSelectedEvent): void {
		if (event) {
			if (event.option.id) {
				this.newSportLeagueForm.get('sportTypeID').setValue(event.option.id);
			}
		}
	}
}
