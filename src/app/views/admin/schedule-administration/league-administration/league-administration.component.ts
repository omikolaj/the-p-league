import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { League } from 'src/app/core/models/schedule/league.model';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
	selector: 'app-league-administration',
	templateUrl: './league-administration.component.html',
	styleUrls: ['./league-administration.component.scss'],
	providers: [ScheduleComponentHelperService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeagueAdministrationComponent implements OnInit {
	leagues$: Observable<League[]>;
	@Input() validationErrors;
	@Input() sportType: SportType;
	@Output() leagueSelectionChanged: EventEmitter<{ matSelectionListChange: MatSelectionListChange; sportTypeID: string }> = new EventEmitter<{
		matSelectionListChange: MatSelectionListChange;
		sportTypeID: string;
	}>();
	@Output() deletedSport: EventEmitter<{ id: string; leaguesCount: number }> = new EventEmitter<{ id: string; leaguesCount: number }>();
	@Output() updatedSportName: EventEmitter<SportType> = new EventEmitter<SportType>();
	editForm: FormGroup;
	sportTypeForm: FormGroup;
	readonlySportName = true;

	constructor(private fb: FormBuilder, private scheduleAdminFacade: ScheduleAdministrationFacade) {}

	// #region ng LifeCycle hooks

	ngOnInit(): void {
		this.leagues$ = this.scheduleAdminFacade.getLeaguesForSportTypeIDFn$.pipe(
			map((filterFn) => filterFn(this.sportType.id)),
			tap((leagues) => {
				this.initForms(leagues);
			})
		);
	}

	// #endregion

	// #region Forms
	initForms(leagues: League[]): void {
		this.initEditForm(leagues);
		this.initSportTypeForm();
	}

	initEditForm(leagues: League[]): void {
		const leagueNameControls = leagues.map((l) =>
			this.fb.group({
				active: this.fb.control(l.active),
				name: this.fb.control(l.name, Validators.required),
				id: this.fb.control(l.id)
			})
		);
		this.editForm = this.fb.group({
			leagues: this.fb.array(leagueNameControls)
		});
	}

	initSportTypeForm(): void {
		this.sportTypeForm = this.fb.group({
			name: this.fb.control(this.sportType.name)
		});
	}

	onSubmit(): void {
		this.readonlySportName ? this.onEditSportType() : this.onSaveSportType();
	}

	onEditSportType(): void {
		this.readonlySportName = !this.readonlySportName;
	}

	onSaveSportType(): void {
		this.readonlySportName = !this.readonlySportName;
		const updatedSport: SportType = {
			id: this.sportType.id,
			active: this.sportType.active,
			name: this.sportTypeForm.get('name').value
		};
		this.updatedSportName.emit(updatedSport);
	}

	onDeleteSportType(): void {
		// In case the sport type was created and the leagues property has
		// not been initialized. This property should be initialized inside
		// the store already. This is just in case

		// if ('leagues' in this.sportType) {
		// 	if (this.sportType.leagues.length > 0) {
		// 		console.warn('Cannot delete sport type that has leagues assigned to it');
		// 		console.error('UPDATE TO DISPLAY TOAST MESSAGE');
		// 		return;
		// 	}
		// }
		this.deletedSport.emit({ id: this.sportType.id, leaguesCount: this.sportType.leagues.length });
	}

	// #endregion

	/**
	 * @param  {MatSelectionListChange} selectedLeaguesEvent
	 *
	 * Gets triggered each time user makes a list selection
	 * It only updates the selected property on each selected leagues    *
	 */
	onLeagueSelectionChange(selectedLeaguesEvent: MatSelectionListChange): void {
		this.leagueSelectionChanged.emit({ matSelectionListChange: selectedLeaguesEvent, sportTypeID: this.sportType.id });
	}

	// #region Event handlers

	/**
	 * @param  {FormGroup} updatedLeagueNames
	 * @param  {League[]} leagues
	 * Fired whenever user updates league names in the edit-leagues-list component
	 */
	onUpdatedLeagues(updatedLeagueNames: FormGroup): void {
		const leaguesToUpdate: League[] = [];
		const leaguesFormArray = updatedLeagueNames.get('leagues') as FormArray;
		for (let index = 0; index < leaguesFormArray.length; index++) {
			const currentLeague = leaguesFormArray.at(index);
			leaguesToUpdate.push({
				id: currentLeague.value.id,
				active: currentLeague.value.active,
				name: currentLeague.value.name
			});
		}
		this.scheduleAdminFacade.updateLeagues(leaguesToUpdate);
	}

	/**
	 * Event handler for when edit-leagues component emits
	 * an array of league ids to be deleted
	 */
	onDeletedLeagues(): void {
		this.scheduleAdminFacade.deleteLeagues(this.sportType.id);
	}

	// #endregion
}
