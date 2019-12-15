import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { SportTypesLeaguesPairs } from 'src/app/views/admin/schedule/models/sport-types-leagues-pairs.model';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { TabTitles } from '../models/tab-titles.model';

@Component({
	selector: 'app-schedule-administration',
	templateUrl: './schedule-administration.component.html',
	styleUrls: ['./schedule-administration.component.scss']
})
export class ScheduleAdministrationComponent implements OnInit {
	sportTypes$: Observable<SportType[]> = this.scheduleAdminFacade.sports$;
	unassignedTeams$: Observable<Team[]> = this.scheduleAdminFacade.unassignedTeams$;
	sportLeaguePairs$: Observable<SportTypesLeaguesPairs[]> = this.scheduleAdminFacade.sportTypesLeaguesPairs$;	
	tabTitle: TabTitles = 'Schedule';
	nextTab: 0 | 1 | 2 | number;
	newSportLeagueForm: FormGroup;
	newTeamForm: FormGroup;	
	// adminComponent: Type<NewScheduleComponent | ModifyScheduleComponent>;
	adminComponent: 'new' | 'modify' | 'playoffs' | 'preview';

	constructor(private fb: FormBuilder, private scheduleAdminFacade: ScheduleAdministrationFacade) {}

	// #region LifeCycle Hooks
	ngOnInit(): void {
		this.initForms();
	}

	ngOnDestroy(): void {}

	// #endregion

	checkSelection(): boolean {
		return this.scheduleAdminFacade.checkLeagueSelection();
	}

	// #region Forms

	initForms(): void {
		this.initNewSportAndLeagueForm();
		this.initNewTeamsForm();
	}

	initNewSportAndLeagueForm(): void {
		this.newSportLeagueForm = this.fb.group({
			sportType: this.fb.control(null, Validators.required),
			leagueName: this.fb.control(null),
			sportTypeID: this.fb.control(null)
		});
	}

	initNewTeamsForm(): void {
		this.newTeamForm = this.fb.group({
			name: this.fb.control(null, Validators.required),
			leagueID: this.fb.control(null, Validators.required)
		});
	}

	// #endregion

	// #region Event Handlers

	onGeneratedSchedules(): void {				
		this.onPreviewSchedule();
	}

	onUpdateSport(updatedSport: { id: string; name: string }): void {
		const updatedSportType: SportType = {
			id: updatedSport.id,
			name: updatedSport.name
		};
		this.scheduleAdminFacade.updateSportType(updatedSportType);
	}

	onDeleteSport(id: string): void {
		this.scheduleAdminFacade.deleteSportType(id);
	}

	onNewSportLeague(newSportLeague: FormGroup): void {
		const newSportType: SportType = {
			name: newSportLeague.get('sportType').value
		};

		const newLeague: League = {
			name: newSportLeague.get('leagueName').value,
			sportTypeID: newSportLeague.get('sportTypeID').value,
			type: newSportType.name
		};
		// if we have sportTypeID were adding to existing sport type
		if (newLeague.sportTypeID) {
			if (newLeague.name) {
				this.scheduleAdminFacade.addLeague(newLeague);
			}
		} else {
			// sanity check to ensure we have new sport name
			if (newSportType.name) {
				// are we also adding new league?
				if (newLeague.name) {
					this.scheduleAdminFacade.addSportAndLeague(newSportType, newLeague);
				} else {
					this.scheduleAdminFacade.addSportType(newSportType);
				}
			}
		}

		// reset the form
		this.newSportLeagueForm.get('sportType').reset();
		this.newSportLeagueForm.get('leagueName').reset();
		this.newSportLeagueForm.get('sportTypeID').reset();
	}

	onNewTeam(newTeamForm: FormGroup): void {
		this.newTeamForm.get('name').reset();
		this.newTeamForm.get('leagueID').reset();

		const newTeam: Team = {
			name: newTeamForm.get('name').value,
			leagueID: newTeamForm.get('leagueID').value,
			selected: true
		};

		this.scheduleAdminFacade.addTeam(newTeam);
	}

	onNewSchedule(): void {
		// Update tab to 'New Schedule' and navigate to it
		this.tabTitle = 'New Schedule';
		this.nextTab = 1;
		// this.adminComponent = NewScheduleComponent;
		this.adminComponent = 'new';
	}

	onPlayOffsSchedule(): void {
		this.tabTitle = 'Playoffs';
		this.nextTab = 1;
	}

	onModifySchedule(): void {
		this.tabTitle = 'Modify';
		this.nextTab = 1;
		// this.adminComponent = ModifyScheduleComponent;
		this.adminComponent = 'modify';
	}

	onPreviewSchedule(): void {		
		this.nextTab = 2;
		// this.adminComponent = PreviewScheduleComponent;
		// this.adminComponent = 'preview';
	}

	// #endregion

	checkExistingSchedule(): boolean {
		const isDisabled = this.checkSelection();
		if (!isDisabled) {
			return this.scheduleAdminFacade.checkExistingSchedule();
		}
		return isDisabled;
	}

	reset(event: MatTabChangeEvent): void {
		this.nextTab = event.index;
	}
}
