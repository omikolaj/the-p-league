import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { Sport } from 'src/app/views/schedule/models/sport.enum';

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
	@Input() sport: Sport;
	@Output() onUnassignTeams: EventEmitter<void> = new EventEmitter<void>();
	@Output() onUpdateTeams: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	@Output() onDeleteTeams: EventEmitter<void> = new EventEmitter<void>();
	@Output() onSelectionChange: EventEmitter<MatSelectionListChange> = new EventEmitter<MatSelectionListChange>();
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

	ngOnInit(): void {}

	// #endregion

	onTeamSelectionChange(event: MatSelectionListChange): void {
		this.numberOfSelectedTeams = event.source.selectedOptions.selected.length;
		this.onSelectionChange.emit(event);
	}

	onSubmit(): void {
		this.disableListSelection ? this.onSaveHandler() : this.onEditHandler();
	}

	onUnassignHandler(): void {
		this.onUnassignTeams.emit();
	}

	onEditHandler(): void {
		this.disableListSelection = !this.disableListSelection;
	}

	onSaveHandler(): void {
		console.log('updatedteamsForm', this.teamsForm);
		this.disableListSelection = !this.disableListSelection;
		this.onUpdateTeams.emit(this.teamsForm);
	}

	onDeleteHandler(): void {
		this.numberOfSelectedTeams = 0;
		this.onDeleteTeams.emit();
	}
}
