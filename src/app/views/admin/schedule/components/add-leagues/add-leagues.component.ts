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

	private addSportTypeIDIfExists(): void {
		if (this.selectedSport) {
			const pair: SportTypesLeaguesPairs = this.selectedSport.option.value as SportTypesLeaguesPairs;
			this.newSportLeagueForm.get('sportTypeID').setValue(pair.id);
		}
	}
}
