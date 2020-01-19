import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material';
import { League } from 'src/app/core/models/schedule/league.model';

@Component({
	selector: 'app-edit-leagues-list',
	templateUrl: './edit-leagues-list.component.html',
	styleUrls: ['./edit-leagues-list.component.scss']
})
export class EditLeaguesListComponent implements OnInit, OnDestroy {
	@Input() editLeaguesForm: FormGroup;
	@Input() leagues: League[];
	@Output() selectedLeagues = new EventEmitter<MatSelectionListChange>();
	@Output() updatedLeagues = new EventEmitter<FormGroup>();
	@Output() deletedLeagues = new EventEmitter<void>();
	disableListSelection = false;
	private numberOfSelectedLeagues = 0;
	get disableEdit(): boolean {
		return this.numberOfSelectedLeagues > 0 ? false : true;
	}
	get disableDelete(): boolean {
		const disable = this.numberOfSelectedLeagues > 0 ? false : true;
		return disable || this.disableListSelection;
	}

	constructor() {}

	ngOnInit(): void {}

	ngOnDestroy(): void {}

	onSelectionChange(event: MatSelectionListChange): void {
		this.numberOfSelectedLeagues = event.source.selectedOptions.selected.length;
		this.selectedLeagues.emit(event);
	}

	onSubmit(): void {
		if (this.disableListSelection) {
			this.onSave();
		} else {
			this.onEdit();
		}
	}

	onEdit(): void {
		this.disableListSelection = !this.disableListSelection;
	}

	onSave(): void {
		this.disableListSelection = !this.disableListSelection;
		this.updatedLeagues.emit(this.editLeaguesForm);
	}

	onDelete(): void {
		this.numberOfSelectedLeagues = 0;
		this.deletedLeagues.emit();
	}

	trackByFn(index: number): number {
		// There seems to be a bug with Angular
		// Without trackByFn the view does not update correctly
		// DO NOT DELETE
		return index;
	}
}
