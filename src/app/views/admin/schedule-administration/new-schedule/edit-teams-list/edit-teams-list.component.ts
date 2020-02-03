import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { League } from 'src/app/core/models/schedule/league.model';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';
import { Team } from 'src/app/core/models/schedule/team.model';

@Component({
	selector: 'app-edit-teams-list',
	templateUrl: './edit-teams-list.component.html',
	styleUrls: ['./edit-teams-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTeamsListComponent implements OnInit {	
	@ViewChild(MatSelectionList, { static: false }) teamList: MatSelectionList;
	@Input() teamsForm: FormGroup;
	@Input() teams: Team[];
	@Input() league: League;
	@Input() sport: SportType;	
	@Output() unassignedTeamsChange: EventEmitter<void> = new EventEmitter<void>();
	@Output() updatedTeams: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	@Output() deletedTeams: EventEmitter<void> = new EventEmitter<void>();
	@Output() teamsSelectionChange: EventEmitter<MatSelectionListChange> = new EventEmitter<MatSelectionListChange>();	
	// private debouncer$: Subject<MatSelectionListChange> = new Subject<MatSelectionListChange>();
	// private unsubscribed$: Subject<void> = new Subject<void>();
	disableListSelection = false;

	get disableActions(): boolean {
		// if there aren't any selected leagues then check if disableListSelection is true or false
		return !this.anySelectedLeagues || this.disableListSelection;
	}

	private get anySelectedLeagues(): boolean {
		if (this.teamList) {
			return this.teamList.selectedOptions.selected.length === 0 ? false : true;
		}
		return false;
	}

	constructor() {
		// this.debouncer$
		// 	.pipe(takeUntil(this.unsubscribed$), debounceTime(1000))
		// 	.subscribe((teamSelection) => this.teamsSelectionChange.emit(teamSelection));
	}

	// #region ng LifeCycle Hooks

	ngOnInit(): void {}

	ngOnDestroy(): void {
		// this.unsubscribed$.next();
		// this.unsubscribed$.complete();
	}

	// #endregion

	onTeamsSelectionChange(event: MatSelectionListChange): void {
		// this.debouncer$.next(event);
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
		this.disableListSelection = !this.disableListSelection;
		this.updatedTeams.emit(this.teamsForm);
	}

	deletedTeamsHandler(): void {
		this.deletedTeams.emit();
	}
}
