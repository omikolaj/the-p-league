import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
export class NewScheduleComponent implements OnInit {
	tab: TabTitles = 'New Schedule';
	assignTeamsForm: FormGroup;
	newSessionForm: FormGroup;
	requireTimeErrorStateMatcher = new RequireTimeErrorStateMatcher();
	selectedTeamIDs: string[] = [];

	leagues$: Observable<{ league: League; teams: Team[] }[]> = combineLatest([
		this.scheduleAdminFacade.selectedLeagues$,
		this.scheduleAdminFacade.getAllForLeagueID$,
		this.scheduleAdminFacade.getSportByID$
	]).pipe(
		map(([selectedLeagues, filterFn, filterSportsFn]) => {
			return selectedLeagues.map((l) => {
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
		this.initNewSessionForm();
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
	 * it is then unwrapped and passed down
	 * to the edit-teams-list component in the template
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

	initNewSessionForm(): void {
		this.newSessionForm = this.fb.group({
			// sessionName: this.fb.control(null),
			sessionStart: this.fb.control(new Date().toISOString(), Validators.required),
			sessionEnd: this.fb.control(new Date().toISOString(), Validators.required),
			numberOfWeeks: this.fb.control(null, Validators.required),
			gamesDays: this.fb.array([this.initGameDayAndTimes()]),
			byeWeeks: this.fb.control(false, Validators.required)
		});
	}

	initGameDayAndTimes(): FormGroup {
		return this.fb.group({
			// gamesDate represents a date for 'nth' number of games
			gamesDay: this.fb.control(null, Validators.required),
			// gamesTimes represents a list of times that games will be
			// played for the given gamesDate
			gamesTimes: this.fb.control([this.initGameTime()], this.requireTime())
		});
	}

	initGameTime(defaultValue?: string): FormGroup {
		return this.fb.group({
			gamesTime: this.fb.control(defaultValue ? defaultValue : null)
		});
	}

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

	// #endregion

	// #region Event Handlers

	/**
	 * @description Triggered when user wants to add additional
	 * control field for another date
	 */
	onGamesDayAdded(): void {
		const control: FormArray = this.newSessionForm.controls['gamesDays'] as FormArray;
		control.push(this.initGameDayAndTimes());
	}

	onGamesDayRemoved(gamesDayIndex: number): void {
		const control = this.newSessionForm.controls['gamesDays'] as FormArray;
		control.removeAt(gamesDayIndex);
	}

	onGamesTimeAdded(event: { gamesDayIndex: number; time: string }): void {
		const gamesDaysFormArray = this.newSessionForm.controls['gamesDays'] as FormArray;

		const control = gamesDaysFormArray.at(event.gamesDayIndex).get('gamesTimes');

		if (event.time) {
			control.value.push(this.initGameTime(event.time.trim()));
		}
		// control.updateValueAndValidity();
	}

	onGamesTimeRemoved(event: { gamesDayIndex: number; gamesTimeIndex: number }): void {
		const gamesDaysFormArray = this.newSessionForm.controls['gamesDays'] as FormArray;
		const control = gamesDaysFormArray.at(event.gamesDayIndex).get('gamesTimes');
		if (event.gamesTimeIndex) {
			control.value.splice(event.gamesTimeIndex, 1);
		}
		// control.updateValueAndValidity();
	}

	onGenerateNewSession(sessionForm: FormGroup): void {
		console.log('logging sessionForm', sessionForm);
	}

	/**
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
	onUpdateTeamsHandler(updatedTeamNames: FormGroup): void {
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

	onTeamsSelectionChangeHandler(selectedTeamsEvent: MatSelectionListChange): void {
		this.selectedTeamIDs = this.scheduleHelper.onSelectionChange(selectedTeamsEvent);
	}

	onUnassignTeamsHandler(leagueID: string): void {
		this.scheduleAdminFacade.unassignTeams(leagueID, this.selectedTeamIDs);
	}

	onDeleteTeamsHandler(leagueID: string): void {
		this.scheduleAdminFacade.deleteTeams(leagueID, this.selectedTeamIDs);
	}

	// #endregion
}
