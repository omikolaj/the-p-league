import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';

@Component({
	selector: 'app-edit-teams-list',
	templateUrl: './edit-teams-list.component.html',
	styleUrls: ['./edit-teams-list.component.scss'],
	// TODO ensure this is not causing issues
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTeamsListComponent implements OnInit {
	@Input() teamsForm: FormGroup;
	@Input() teams: Team[];
	@Input() league: League;
	@Input() sport: SportType;
	@Output() unassignedTeamsChange: EventEmitter<void> = new EventEmitter<void>();
	@Output() updatedTeams: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	@Output() deletedTeams: EventEmitter<void> = new EventEmitter<void>();
	@Output() teamsSelectionChange: EventEmitter<MatSelectionListChange> = new EventEmitter<MatSelectionListChange>();
	disableListSelection = false;
	// assumes we have at least one team selected when initialized
	private numberOfSelectedTeams = 1;
	get disableEdit(): boolean {
		return this.numberOfSelectedTeams > 0 ? false : true;
	}
	get disableDelete(): boolean {
		const disable = this.numberOfSelectedTeams > 0 ? false : true;
		return disable || this.disableListSelection;
	}
	@ViewChild(MatSelectionList, { static: false }) teamList: MatSelectionList;

	constructor() {}

	// #region ng LifeCycle Hooks

	ngOnInit(): void {		
	}

	// #endregion

	onTeamsSelectionChange(event: MatSelectionListChange): void {
		this.numberOfSelectedTeams = event.source.selectedOptions.selected.length;
		this.teamsSelectionChange.emit(event);
	}

	onSubmit(): void {
		this.disableListSelection ? this.onSaveHandler() : this.onEditHandler();
	}

	unassignedTeamsChangeHandler(): void {
		this.unassignedTeamsChange.emit();
	}

	onEditHandler(): void {
		this.disableListSelection = !this.disableListSelection;
	}

	onSaveHandler(): void {
		console.log('updatedteamsForm', this.teamsForm);
		this.disableListSelection = !this.disableListSelection;
		this.updatedTeams.emit(this.teamsForm);
	}

	deletedTeamsHandler(): void {
		this.numberOfSelectedTeams = 0;
		this.deletedTeams.emit();
	}
}
