import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material';
import * as moment from 'moment';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { ScheduleHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-helper.service';
import { UNASSIGNED } from 'src/app/helpers/Constants/ThePLeagueConstants';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { TabTitles } from '../../models/tab-titles.model';
import { RequireTimeErrorStateMatcher } from './require-time-error-state-matcher';

@Component({
	selector: 'app-new-schedule',
	templateUrl: './new-schedule.component.html',
	styleUrls: ['./new-schedule.component.scss'],
	providers: [ScheduleHelperService],
	// TODO test this to ensure its not causing unexpected behavior
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewScheduleComponent implements OnInit, OnDestroy {
	tab: TabTitles = 'New Schedule';
	assignTeamsForm: FormGroup;
	newSessionsForm: FormGroup;
	requireTimeErrorStateMatcher = new RequireTimeErrorStateMatcher();
	selectedTeamIDs: string[] = [];
	private unsubscribe$ = new Subject<void>();

	leagues$: Observable<{ league: League; teams: Team[] }[]> = combineLatest([
		this.scheduleAdminFacade.selectedLeagues$,
		this.scheduleAdminFacade.getAllForLeagueID$,
		this.scheduleAdminFacade.getSportByID$
	]).pipe(
		map(([selectedLeagues, filterFn, filterSportsFn]) => {
			return selectedLeagues.map((l) => {
				this.initNewSessionsForm();
				return { league: l, teams: filterFn(l.id), form: this.initEditTeamsForm(filterFn(l.id)), sport: filterSportsFn(l.sportTypeID) };
			});
		})
	);

	unassignedTeamsData$ = combineLatest(this.scheduleAdminFacade.unassignedTeams$, this.scheduleAdminFacade.sportTypesLeaguesPairs$).pipe(
		tap(([unassignedTeams]) => this.initAssignTeamsForm(unassignedTeams)),
		map(([unassignedTeams, pairs]) => {
			return { pairs, unassignedTeams };
		})
	);

	constructor(private scheduleAdminFacade: ScheduleAdministrationFacade, private scheduleHelper: ScheduleHelperService, private fb: FormBuilder) {}

	ngOnInit(): void {
		// this.initNewSessionForm();
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	// #region Init Forms

	/**
	 * @param  {Team[]} unassignedTeams
	 * Initializes form for the unassigned-teams component
	 */
	initAssignTeamsForm(unassignedTeams: Team[]): void {
		const assignTeamControls = [];
		unassignedTeams.forEach((t) => {
			assignTeamControls.push(
				this.fb.group({
					teamName: this.fb.control(t.name),
					teamID: this.fb.control(t.id),
					leagueID: this.fb.control(UNASSIGNED)
				})
			);
		});

		this.assignTeamsForm = this.fb.group({
			unassignedTeams: this.fb.array(assignTeamControls)
		});
	}

	/**
	 * @param  {Team[]} teams
	 * @returns FormGroup
	 * Since we need to compose a separate edit team form for each
	 * league, we have to return a form group here and wrap it
	 * inside an observable (the wrapping of the observable occurs in the leagues$ pipe),
	 * it is then unwrapped in the template and passed down
	 * to the edit-teams-list component
	 */
	initEditTeamsForm(teams: Team[]): FormGroup {
		const teamNameControls = teams.map((t) =>
			this.fb.group({
				id: this.fb.control(t.id),
				name: this.fb.control(t.name, Validators.required)
			})
		);

		return this.fb.group({
			teams: this.fb.array(teamNameControls)
		});
	}

	// #region New Session Form

	/**
	 * @description Initializes the newSessionsForm if it has not been initialized
	 * if it has been initialized, it adds a new formGroup entry
	 * onto the sessions formArray. Inside the template each formGroup is then retrieved
	 * by index and is passed down to the app-new-session-schedule component
	 *
	 */
	initNewSessionsForm(): void {
		const sessionForm = this.initSessionForm();
		if (this.newSessionsForm && this.newSessionsForm['controls']) {
			const formArray = this.newSessionsForm['controls'].sessions as FormArray;
			formArray.controls.push(sessionForm);
			const formIndex = formArray.controls.indexOf(sessionForm);
			this.syncronizeDates(formIndex);
		} else {
			this.newSessionsForm = this.fb.group({
				sessions: this.fb.array([sessionForm])
			});
			// Since this block of code only gets executed when the newSessionsForm
			// is undefined, we can be sure that the created sessionForm is the first one
			this.syncronizeDates(0);
		}
	}

	/**
	 * @description Initializes formGroup instances that represents new session
	 * information for a league
	 * @returns FormGroup representing new session information for the given league
	 */
	initSessionForm(): FormGroup {
		return this.fb.group({
			// sessionName: this.fb.control(null),
			sessionDateInfo: this.fb.group({
				sessionStart: this.fb.control(new Date().toISOString(), Validators.required),
				sessionEnd: this.fb.control(new Date().toISOString(), Validators.required),
				numberOfWeeks: this.fb.control(null, Validators.required)
			}),
			gamesDays: this.fb.array([this.initGameDayAndTimes()]),
			byeWeeks: this.fb.control(false, Validators.required)
		});
	}

	/**
	 * @description Initializes a formGroup instance that represents
	 * a single game day (day week Monday, Tuesday etc.) and an array of game time controls ([{gameTime: 9:00am}, {gameTime: 6:00pm}])
	 * @returns returns formGroup instance for gameDay and gameTimes
	 */
	initGameDayAndTimes(): FormGroup {
		return this.fb.group({
			// gamesDate represents a date for 'nth' number of games
			gamesDay: this.fb.control(null, Validators.required),
			// gamesTimes represents a list of times that games will be
			// played for the given gamesDate
			gamesTimes: this.fb.control([this.initGameTime()], this.requireTime())
		});
	}

	/**
	 * @description Initializes game time formGroup that represents a single
	 * game time instance (9:00am, 11:00pm etc)
	 * @param [defaultValue] used when adding a new game time to the parent formArray
	 * (see initGameDayAndTimes() => gameTimes property). This sets the default input value
	 * to whatever user has selected in the UI. When new game time (mat-chip) is added, new game time is pushed to the formArray with user entered value, the defaultValue.
	 * @returns game time
	 */
	initGameTime(defaultValue?: string): FormGroup {
		return this.fb.group({
			gamesTime: this.fb.control(defaultValue ? defaultValue : null)
		});
	}

	/**
	 * @description Custom validator used by initGameDayAndTimes() => gamesTimes property. Checks to see if user has entered any game times. At least one game time is required.
	 * @returns whether the validator function returned an error or null if everything was ok
	 */
	requireTime(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const gamesTimesFiltered = control.value.filter((formGroup) => formGroup.value.gamesTime !== null);
			if (gamesTimesFiltered.length) {
				return null;
			}
			return { timeRequired: { value: 'Please specify a time' } };
		};
	}

	// #endregion

	// #endregion

	// #region Private Methods

	/**
	 * @description Syncronizes the end date based on number of weeks specified by the user in the UI.
	 * It will also adjust the end date based on specified start date only if number of weeks has been already specified.
	 * @returns subscription for the consuming code to properly dispose of it
	 */
	private syncronizeDates(sessionFormGroupIndex: number): void {
		const sessions = this.newSessionsForm.controls['sessions'] as FormArray;
		// const sessionDateInfoFormGroup = this.newSessionForm['controls'].sessionDateInfo;
		const sessionDateInfoFormGroup = sessions.at(sessionFormGroupIndex).get('sessionDateInfo');
		const sessionStartControl = sessionDateInfoFormGroup['controls'].sessionStart as AbstractControl;
		const sessionEndControl = sessionDateInfoFormGroup['controls'].sessionEnd as AbstractControl;
		const numberOfWeeksControl = sessionDateInfoFormGroup['controls'].numberOfWeeks as AbstractControl;

		sessionStartControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((start: moment.Moment) => {
			// get number of weeks value
			const numberOfWeeks = numberOfWeeksControl.value;
			if (numberOfWeeks) {
				sessionEndControl.setValue(moment(start).add(numberOfWeeks, 'w'));
			}
		});

		numberOfWeeksControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((weeks) => {
			sessionEndControl.setValue(moment().add(weeks, 'w'));
		});
	}

	// #endregion

	// #region Event Handlers

	/**
	 * @description Triggered whenever user submits the new sessions form
	 */
	onSubmit() {
		console.log('submitted', this.newSessionsForm);
	}

	/**
	 * @description Triggered when user wants to add additional
	 * control field for additional game day during the week
	 */
	onGamesDayAdded(sessionFormGroupIndex: number): void {
		const sessions = this.newSessionsForm.controls['sessions'] as FormArray;
		const control: FormArray = sessions.at(sessionFormGroupIndex).get('gamesDays') as FormArray;
		control.push(this.initGameDayAndTimes());
	}

	/**
	 * @description Removes user added game day field. This can only ever be triggered
	 * if user has already added an additional game day field
	 * @param gamesDayIndex since user can add multiple additional game days for any given league, we need to know which game day they want to remove
	 * @param sessionFormGroupIndex since there are multiple session forms, we need to know which session form we need to perform this action on
	 */
	onGamesDayRemoved(gamesDayIndex: number, sessionFormGroupIndex: number): void {
		const sessions = this.newSessionsForm.controls['sessions'] as FormArray;
		const control = sessions.at(sessionFormGroupIndex).get('gamesDays') as FormArray;
		control.removeAt(gamesDayIndex);
	}

	/**
	 * @description For any given game day, user can specify multiple game times. This is triggered whenever user adds a new game time to the list
	 * @param event { gamesDayIndex: number; time: string } event.gamesDayIndex represents the given game day (Monday, Tuesday etc.) user wants to add a new game time to. event.time reprsents the actual string value of the time user is adding (9:00am, 10:30pm etc.)
	 * @param sessionFormGroupIndex since there are multiple session forms, we need to know which session form we need to perform this action on
	 */
	onGamesTimeAdded(event: { gamesDayIndex: number; time: string }, sessionFormGroupIndex: number): void {
		const sessions = this.newSessionsForm.controls['sessions'] as FormArray;
		const gamesDaysFormArray = sessions.at(sessionFormGroupIndex).get('gamesDays') as FormArray;
		const control = gamesDaysFormArray.at(event.gamesDayIndex).get('gamesTimes');
		if (event.time) {
			control.value.push(this.initGameTime(event.time.trim()));
		}
	}

	/**
	 * @description Triggered when user removes any game times that they already added to the list
	 * @param event { gamesDayIndex: number; time: string } event.gamesDayIndex represents the given game day (Monday, Tuesday etc.) user wants to add a new game time to. event.time reprsents the actual string value of the time user is adding (9:00am, 10:30pm etc.)
	 * @param sessionFormGroupIndex since there are multiple session forms, we need to know which session form we need to perform this action on
	 */
	onGamesTimeRemoved(event: { gamesDayIndex: number; gamesTimeIndex: number }, sessionFormGroupIndex): void {
		const sessions = this.newSessionsForm.controls['sessions'] as FormArray;
		const gamesDaysFormArray = sessions.at(sessionFormGroupIndex).get('gamesDays') as FormArray;
		const control = gamesDaysFormArray.at(event.gamesDayIndex).get('gamesTimes');
		if (event.gamesTimeIndex) {
			control.value.splice(event.gamesTimeIndex, 1);
		}
	}

	onNewSessionGenerated(sessionForm: FormGroup): void {
		console.log('logging sessionForm', sessionForm);
	}

	/**
	 * TODO extract this logic into service this is not view related logic
	 * @param  {FormGroup} assignedTeamsForm
	 * Fired whenever user assigns teams to a league.
	 * Creating shell team object to carry the team ID and the league the team should be assigned to
	 * instead of creating a separate object to carry this information
	 */
	onAssignTeams(assignedTeamsForm: FormGroup): void {
		const formControls = [...assignedTeamsForm.get('unassignedTeams')['controls']];
		const teamsToAssign: Team[] = [];
		for (let index = 0; index < formControls.length; index++) {
			const control: FormGroup = formControls[index];
			if (control.value.leagueID !== UNASSIGNED) {
				teamsToAssign.push({
					id: control.value.teamID,
					leagueID: control.value.leagueID
				});
			}
		}
		this.scheduleAdminFacade.assignTeams(teamsToAssign);
	}

	/**
	 * @param  {FormGroup} updatedTeams
	 * Fired whenever user updates team names in the edit-teams-list component
	 */
	onUpdatedTeams(updatedTeamNames: FormGroup): void {
		const teamsToUpdate: Team[] = [];
		const teamsFormArray = updatedTeamNames.get('teams') as FormArray;
		for (let index = 0; index < teamsFormArray.length; index++) {
			const currentTeam = teamsFormArray.at(index);
			teamsToUpdate.push({
				id: currentTeam.value.id,
				name: currentTeam.value.name
			});
		}

		this.scheduleAdminFacade.updateTeams(teamsToUpdate);
	}

	onTeamsSelectionChange(selectedTeamsEvent: MatSelectionListChange): void {
		this.selectedTeamIDs = this.scheduleHelper.onSelectionChange(selectedTeamsEvent);
	}

	onUnassignedTeamsChange(leagueID: string): void {
		this.scheduleAdminFacade.unassignTeams(leagueID, this.selectedTeamIDs);
	}

	onDeletedTeams(leagueID: string): void {
		this.scheduleAdminFacade.deleteTeams(leagueID, this.selectedTeamIDs);
	}

	// #endregion
}
