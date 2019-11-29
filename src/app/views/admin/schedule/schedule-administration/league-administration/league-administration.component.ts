import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { ScheduleHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-helper.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';

@Component({
	selector: 'app-league-administration',
	templateUrl: './league-administration.component.html',
	styleUrls: ['./league-administration.component.scss'],
	providers: [ScheduleHelperService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeagueAdministrationComponent implements OnInit {
	leagues$: Observable<League[]>;
	@Input() sportType: SportType;
	@Output() deletedSport: EventEmitter<string> = new EventEmitter<string>();
	@Output() updatedSportName: EventEmitter<{
		id: string;
		name: string;
	}> = new EventEmitter<{ id: string; name: string }>();
	editForm: FormGroup;
	sportTypeForm: FormGroup;
	readonlySportName = true;

	constructor(private fb: FormBuilder, private scheduleAdminFacade: ScheduleAdministrationFacade, private scheduleHelper: ScheduleHelperService) {}

	// #region ng LifeCycle hooks

	ngOnInit(): void {
		this.leagues$ = this.scheduleAdminFacade.getAllForSportTypeID$.pipe(
			map((filterFn) => filterFn(this.sportType.id)),
			tap((leagues) => {
				this.initForms(leagues);
			})
		);
	}

	ngOnDestroy(): void {
		console.log('destroying league admin');
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
		const updatedSport = {
			id: this.sportType.id,
			name: this.sportTypeForm.get('name').value
		};
		this.updatedSportName.emit(updatedSport);
	}

	onDeleteSportType(): void {
		// In case the sport type was created and the leagues property has
		// not been initialized. This property should be initialized inside
		// the store already. This is just in case
		if ('leagues' in this.sportType) {
			if (this.sportType.leagues.length > 0) {
				console.warn('Cannot delete sport type that has leagues assigned to it');
				console.error('UPDATE TO DISPLAY TOAST MESSAGE');
				return;
			}
		}
		this.deletedSport.emit(this.sportType.id);
	}

	// #endregion

	/**
	 * @param  {MatSelectionListChange} selectedLeaguesEvent
	 *
	 * Gets triggered each time user makes a list selection
	 * It only updates the selected property on each selected leagues    *
	 */
	onLeagueSelectionChange(selectedLeaguesEvent: MatSelectionListChange): void {
		const ids: string[] = this.scheduleHelper.onSelectionChange(selectedLeaguesEvent);

		this.scheduleAdminFacade.updateSelectedLeagues(ids, this.sportType.id);
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
