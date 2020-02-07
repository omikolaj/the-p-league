import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import * as moment from 'moment';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, flatMap, map, takeUntil, tap } from 'rxjs/operators';
import { TabTitles } from 'src/app/core/models/admin/tab-titles.model';
import LeagueSessionScheduleDTO from 'src/app/core/models/schedule/classes/league-session-schedule-DTO.model';
import { GameDay } from 'src/app/core/models/schedule/game-day.model';
import { League } from 'src/app/core/models/schedule/league.model';
import { MatchDay } from 'src/app/core/models/schedule/match-days.enum';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';
import { Team } from 'src/app/core/models/schedule/team.model';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { ScheduleComponentHelperService } from 'src/app/core/services/schedule/schedule-administration/schedule-component-helper.service';
import { TIME_FORMAT, UNASSIGNED } from 'src/app/shared/constants/the-p-league-constants';
import { enumKeysToArray } from 'src/app/shared/helpers/enum-keys-to-array';
import { RequireTimeErrorStateMatcher } from './require-time-error-state-matcher';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
	selector: 'app-new-schedule',
	templateUrl: './new-schedule.component.html',
	styleUrls: ['./new-schedule.component.scss'],
	providers: [ScheduleComponentHelperService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewScheduleComponent implements OnInit, OnDestroy {
	tab: TabTitles = 'New Schedule';
	assignTeamsForm: FormGroup;
	newLeagueSessionsForm: FormGroup;
	requireTimeErrorStateMatcher = new RequireTimeErrorStateMatcher();
	selectedTeams: { leagueID: string; selectedTeamIDs: string[] }[] = [];
	isMobile = this.scheduleAdminFacade.isMobile;
	private unsubscribe$ = new Subject<void>();
	@Output() generateSchedules = new EventEmitter<string[]>();

	/**
	 * @description this stream is necessary to ensure we are invoking
	 * this.initNewLeagueSessionsForm only once, when user navigates to
	 * new-schedule component. Otherwise, if the this.scheduleAdminFacade.selectedLeagues$
	 * stream was included in the leagues$ = combineLatest([this.scheduleAdminFacade.selectedLeagues$, ..., ...])
	 * and we were to invoke this.initNewLeagueSessionForm() inside that stream, then each time
	 * user would select/de-select a team from the list in the edit-teams-list component
	 * combineLatest would invoke this.initNewLeagueSessionsForm, because it would notice that
	 * this.scheduleAdminFacad.getAllForLeagueID$ observable emited new value, and this observable stream
	 * is part of the teams state.
	 */
	private selectedLeagues$ = this.scheduleAdminFacade.selectedLeagues$.pipe(
		// distinctUntilChanged is necessary because when user adds new league,
		// then adds new team to that league, part of the logic we update the effected league's
		// teams property, thus emitting new value and calling this.initNewLeagueSeessionsForm.
		distinctUntilChanged((prev, curr) => prev.length === curr.length),
		flatMap((selectedLeagues) => {
			return this.scheduleAdminFacade.getActiveSessionsInfo(selectedLeagues.map((l) => l.id)).pipe(
				tap((_) => selectedLeagues.forEach((selectedLeague) => this.initNewLeagueSessionsForm(selectedLeague.id))),
				map((_) => selectedLeagues)
			);
		})
	);

	leagues$: Observable<{ league: League; teams: Team[]; form: FormGroup; sport: SportType }[]> = combineLatest([
		this.selectedLeagues$,
		this.scheduleAdminFacade.getTeamsForLeagueIDFn$,
		this.scheduleAdminFacade.getSportByID$,
		this.scheduleAdminFacade.getSessionInfoByLeagueIDFn$
	]).pipe(
		map(([selectedLeagues, filterFn, filterSportsFn, activeSessionFn]) => {
			return selectedLeagues.map((l) => {
				return {
					league: l,
					teams: filterFn(l.id),
					form: this.initEditTeamsForm(filterFn(l.id)),
					sport: filterSportsFn(l.sportTypeID),
					sessionInfo: activeSessionFn(l.id)
				};
			});
		})
	);

	unassignedTeamsData$ = combineLatest(this.scheduleAdminFacade.unassignedTeams$, this.scheduleAdminFacade.sportTypesLeaguesPairs$).pipe(
		tap(([unassignedTeams]) => this.initAssignTeamsForm(unassignedTeams)),
		map(([unassignedTeams, pairs]) => {
			return { pairs, unassignedTeams };
		})
	);

	constructor(
		private scheduleAdminFacade: ScheduleAdministrationFacade,
		private scheduleHelper: ScheduleComponentHelperService,
		private fb: FormBuilder
	) {}

	ngOnInit(): void {}

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
					name: this.fb.control(t.name),
					id: this.fb.control(t.id),
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
	 * @description Initializes the NewLeagueSessionsForm if it has not been initialized
	 * if it has been initialized, it adds a new formGroup entry
	 * onto the sessions formArray. Inside the template each formGroup is then retrieved
	 * by index and is passed down to the app-new-session-schedule component
	 *
	 */
	initNewLeagueSessionsForm(leagueID: string): void {
		const sessionForm = this.initSessionForm(leagueID);
		if (this.newLeagueSessionsForm && this.newLeagueSessionsForm['controls']) {
			const formArray = this.newLeagueSessionsForm['controls'].sessions as FormArray;
			formArray.controls.push(sessionForm);
			const formIndex = formArray.controls.indexOf(sessionForm);
			this.syncronizeDates(formIndex);
			// for some reason the sessionsForm was invalid if updateValueAndValidity was not executed
			sessionForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((_) => {
				formArray.updateValueAndValidity();
			});
		} else {
			this.newLeagueSessionsForm = this.fb.group({
				sessions: this.fb.array([sessionForm])
			});
			// Since this block of code only gets executed when the NewLeagueSessionsForm
			// is undefined, we can be sure that the created sessionForm is the first one
			this.syncronizeDates(0);
		}
	}

	/**
	 * @description Initializes formGroup instances that represents new session
	 * information for a league
	 *
	 * @returns FormGroup representing new session information for the given league
	 */
	initSessionForm(leagueID: string): FormGroup {
		return this.fb.group({
			leagueID: this.fb.control(leagueID),
			sessionDateInfo: this.fb.group({
				sessionStart: this.fb.control(null, [Validators.required, this.validateActiveSession(leagueID)]),
				sessionEnd: this.fb.control(moment(new Date().toISOString()), Validators.required),
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
	initGameDayAndTimes(availableDays?: string[]): FormGroup {
		return this.fb.group({
			// if availableDays are not specified return all 7 days string[]
			availableGamesDays: this.fb.control(availableDays || enumKeysToArray(MatchDay)),
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

	// #region Custom Form Validators

	private validateActiveSession(leagueID: string): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const sessionInfo = this.scheduleAdminFacade.sessionInfoByLeagueID(leagueID);
			// check if the server returned any session info for selected leagues
			if (sessionInfo) {
				if (moment(sessionInfo.endDate).isSameOrAfter(moment(control.value))) {
					return { sessionInProgress: { value: `Specify date after ${moment(sessionInfo.endDate).format('MM/DD/YYYY')}` } };
				}
			}
			return null;
		};
	}

	/**
	 * @description Custom validator used by initGameDayAndTimes() => gamesTimes property. Checks to see if user has entered any game times. At least one game time is required.
	 * @returns whether the validator function returned an error or null if everything was ok
	 */
	private requireTime(): ValidatorFn {
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

	// #endregion

	// #region Private Methods

	/**
	 * @description Syncronizes the end date based on number of weeks specified by the user in the UI.
	 * It will also adjust the end date based on specified start date only if number of weeks has been already specified.
	 * @returns subscription for the consuming code to properly dispose of it
	 */
	private syncronizeDates(sessionFormGroupIndex: number): void {
		const sessions = this.newLeagueSessionsForm.controls['sessions'] as FormArray;
		// const sessionDateInfoFormGroup = this.NewLeagueSessionForm['controls'].sessionDateInfo;
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
			const sessionStartDate = sessionStartControl.value;
			if (sessionStartDate) {
				sessionEndControl.setValue(moment(sessionStartDate).add(weeks, 'w'));
			} else {
				sessionEndControl.setValue(moment().add(weeks, 'w'));
			}
		});
	}

	private removeSelectedDays(gamesDaysControl: FormArray): string[] {
		let availableDays = enumKeysToArray(MatchDay);
		// get all selected days
		for (let index = 0; index < gamesDaysControl.length; index++) {
			const gamesDayControl: AbstractControl = gamesDaysControl.at(index);
			availableDays = availableDays.filter((d) => d !== gamesDayControl.value.gamesDay);
		}

		return availableDays;
	}

	/**
	 * @description Updates the available days in the drop down list. When user goes to remove a day
	 * they added, we want to add this day to the drop down list of all available days. When user selects
	 * a to add a day such as Tuesday, we filter the available days drop down list to omit displaying
	 * Tuesday for two different days
	 * @param gamesDaysControl
	 * @param gamesDayIndex
	 */
	private updateAvailableDays(gamesDaysControl: FormArray, gamesDayIndex: number): void {
		// get the gamesDay availableDays value before we delete it;
		const dayToAdd: string = gamesDaysControl.at(gamesDayIndex).value.gamesDay;
		for (let index = 0; index < gamesDaysControl.length; index++) {
			// if the current index does not equal gamesDayIndex add it to the available list
			if (index !== gamesDayIndex) {
				const gamesDayControl: AbstractControl = gamesDaysControl.at(index);
				if (!gamesDayControl.value.availableGamesDays.includes(dayToAdd)) {
					gamesDayControl.patchValue({
						availableGamesDays: [...gamesDayControl.value.availableGamesDays, dayToAdd]
					});
					gamesDayControl.updateValueAndValidity();
				}
			}
		}
	}

	// #endregion

	// #region Event Handlers

	/**
	 * @description Triggered when user wants to add additional
	 * control field for additional game day during the week
	 */
	onGamesDayAdded(sessionFormGroupIndex: number): void {
		const sessions = this.newLeagueSessionsForm.controls['sessions'] as FormArray;
		const control: FormArray = sessions.at(sessionFormGroupIndex).get('gamesDays') as FormArray;
		control.push(this.initGameDayAndTimes(this.removeSelectedDays(control)));
	}

	/**
	 * @description Removes user added game day field. This can only ever be triggered
	 * if user has already added an additional game day field
	 * @param gamesDayIndex since user can add multiple additional game days for any given league, we need to know which game day they want to remove
	 * @param sessionFormGroupIndex since there are multiple session forms, we need to know which session form we need to perform this action on
	 */
	onGamesDayRemoved(gamesDayIndex: number, sessionFormGroupIndex: number): void {
		const sessions = this.newLeagueSessionsForm.controls['sessions'] as FormArray;
		const control = sessions.at(sessionFormGroupIndex).get('gamesDays') as FormArray;
		this.updateAvailableDays(control, gamesDayIndex);
		control.removeAt(gamesDayIndex);
	}

	/**
	 * @description For any given game day, user can specify multiple game times. This is triggered whenever user adds a new game time to the list
	 * @param event { gamesDayIndex: number; time: string } event.gamesDayIndex represents the given game day (Monday, Tuesday etc.) user wants to add a new game time to. event.time reprsents the actual string value of the time user is adding (9:00am, 10:30pm etc.)
	 * @param sessionFormGroupIndex since there are multiple session forms, we need to know which session form we need to perform this action on
	 */
	onGamesTimeAdded(event: { gamesDayIndex: number; time: string }, sessionFormGroupIndex: number): void {
		const sessions = this.newLeagueSessionsForm.controls['sessions'] as FormArray;
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
		const sessions = this.newLeagueSessionsForm.controls['sessions'] as FormArray;
		const gamesDaysFormArray = sessions.at(sessionFormGroupIndex).get('gamesDays') as FormArray;
		const control = gamesDaysFormArray.at(event.gamesDayIndex).get('gamesTimes');
		if (event.gamesTimeIndex) {
			control.value.splice(event.gamesTimeIndex, 1);
		}
	}

	/**
	 * @description Triggered when user selects the 'Generate' button to create
	 * schedules for the selected teams
	 */
	onGenerate(leaguesData: { league: League; teams: Team[]; form: FormGroup; sport: SportType }[]): void {
		const newLeagueSessions: LeagueSessionScheduleDTO[] = [];
		const sessions = this.newLeagueSessionsForm.value['sessions'] as [];
		// iterate over all new sessions that were submitted
		sessions.forEach((s: any) => {
			// create new object with the NewLeagueSession shape
			const session: LeagueSessionScheduleDTO = {
				leagueID: s.leagueID,
				byeWeeks: s.byeWeeks,
				numberOfWeeks: s.sessionDateInfo.numberOfWeeks,
				sessionStart: s.sessionDateInfo.sessionStart,
				sessionEnd: s.sessionDateInfo.sessionEnd,
				// initialize the gamesDays array so we can push objects to it
				gamesDays: []
			};

			// iterate over each session gamesDays. gD stands for gamesDay
			s.gamesDays.forEach((gD) => {
				// create an object that has GameDay shape
				const gamesDayValue: GameDay = {
					// set the gamesDay property to a day of the week
					gamesDay: gD.gamesDay,
					// initialize the gamesTimes array so we can push objects to it
					gamesTimes: []
				};

				// iterate over each gamesDay gamesTimes array. gT stands for gamesTime
				gD.gamesTimes.forEach((gT: FormGroup) => {
					// filter out any gamesTime values that are null/undefined
					if (gT.value.gamesTime) {
						// add the gamesTime value to the gamesDayValue gamesTime array
						gamesDayValue.gamesTimes.push({
							gamesTime: moment(gT.value.gamesTime, TIME_FORMAT).unix()
						});
					}
				});

				// push the extracted gamesDay to the session gamesDays array
				session.gamesDays.push(gamesDayValue);
			});
			// push the entire session object to the new sessions array
			newLeagueSessions.push(session);
		});

		// update the teams selection
		if (this.selectedTeams.length > 0) {
			this.scheduleAdminFacade.updateTeamSelection(this.selectedTeams);
		}
		// send the new sessions array to the facade for further handling
		this.scheduleAdminFacade.generatePreviewSchedules(newLeagueSessions);
		// iterate over the selected leaguesData list, and emit all selected league IDs
		this.generateSchedules.emit(leaguesData.map((leagueData) => leagueData.league.id));
	}

	/**
	 * @param  {FormGroup} assignedTeamsForm
	 * Fired whenever user assigns teams to a league.
	 * Creating shell team object to carry the team ID and the league the team should be assigned to
	 * instead of creating a separate object to carry this information
	 */
	onAssignTeams(assignedTeamsForm: FormGroup): void {
		const teamsToAssign: Team[] = assignedTeamsForm.value.unassignedTeams.filter((t: Team) => t.leagueID !== UNASSIGNED);
		this.scheduleAdminFacade.assignTeams(teamsToAssign);
	}

	/**
	 * @param  {FormGroup} updatedTeams
	 * Fired whenever user updates team names in the edit-teams-list component
	 */
	onUpdatedTeams(updatedTeamNames: FormGroup): void {
		const teamsToUpdate: Team[] = updatedTeamNames.value.teams;
		this.scheduleAdminFacade.updateTeams(teamsToUpdate);
	}

	onTeamsSelectionChange(selectedTeamsEvent: MatSelectionListChange, leagueID: string): void {
		const selectedTeamIDs = this.scheduleHelper.onSelectionChange(selectedTeamsEvent);
		if (this.selectedTeams.some((teamLeaguePair) => teamLeaguePair.leagueID === leagueID)) {
			// replace
			const replace = this.selectedTeams.find((t) => t.leagueID === leagueID);
			const indexToReplace = this.selectedTeams.indexOf(replace);
			this.selectedTeams[indexToReplace] = { leagueID: leagueID, selectedTeamIDs: selectedTeamIDs };
		} else {
			this.selectedTeams = [...this.selectedTeams, { leagueID: leagueID, selectedTeamIDs: selectedTeamIDs }];
		}
	}

	onUnassignedTeamsChange(leagueID: string): void {
		// ensures we only call udpate selected teams when user selects unassign button
		if (this.selectedTeams.length > 0) {
			this.scheduleAdminFacade.updateTeamSelection(this.selectedTeams);
		}
		this.scheduleAdminFacade.unassignTeams(leagueID);
	}

	onDeletedTeams(leagueID: string): void {
		// ensures that we only update selected teams when user selects delete button
		if (this.selectedTeams.length > 0) {
			this.scheduleAdminFacade.updateTeamSelection(this.selectedTeams);
		}
		const teamsLeaguePair = this.selectedTeams.find((t) => t.leagueID === leagueID);
		if (teamsLeaguePair) {
			this.scheduleAdminFacade.deleteTeams(teamsLeaguePair.leagueID, teamsLeaguePair.selectedTeamIDs);
		}
	}

	// #endregion
}
