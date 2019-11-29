import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatExpansionPanel } from '@angular/material';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
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
	@ViewChild('auto', { static: false }) autoComplete: MatAutocomplete;
	private unsubscribe$ = new Subject<void>();
	private selectedSport: MatAutocompleteSelectedEvent;

	constructor() {}

	ngAfterViewInit(): void {
		this.autoComplete.optionSelected
			.pipe(
				takeUntil(this.unsubscribe$),
				filter((selected: MatAutocompleteSelectedEvent) => selected !== undefined),
				tap((selected) => (this.selectedSport = selected))
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	onSubmit(formGroupDirective: FormGroupDirective): void {
		this.addSportTypeIDIfExists();
		this.updateSportTypeIfExists();

		const newSportLeague = cloneDeep(this.newSportLeagueForm);
		// Necessary to reset validations
		formGroupDirective.resetForm();

		this.onNewSportLeague.emit(newSportLeague);
		// Collapse the expansion panel
		this.matExpansionPanel.close();
		// Clear any selected sport from memory
		this.selectedSport = undefined;
	}

	displayFn(pair?: SportTypesLeaguesPairs): string | undefined {
		return pair ? pair.name : undefined;
	}

	/**
	 * @description When user selects a sport that already exists
	 * we already know its id, so we want to update the form to reflect
	 * this id.
	 */
	private addSportTypeIDIfExists(): void {
		if (this.selectedSport) {
			const pair: SportTypesLeaguesPairs = this.selectedSport.option.value as SportTypesLeaguesPairs;
			this.newSportLeagueForm.get('sportTypeID').setValue(pair.id);
		}
	}

	/**
	 * @description When user selects a sport from the list that
	 * already exists, the template will use the 'pair' object as
	 * the selected value instead of just the sport name.
	 * This method checks to see if we have selected sport
	 * and then updates the value to be the sport name instead
	 * of leaving it as pair object. Makes it easier in the parent
	 * component to extract the sport name from the form
	 */
	private updateSportTypeIfExists(): void {
		if (this.selectedSport) {
			const pair: SportTypesLeaguesPairs = this.selectedSport.option.value as SportTypesLeaguesPairs;
			this.newSportLeagueForm.get('sportType').setValue(pair.name);
		}
	}
}
