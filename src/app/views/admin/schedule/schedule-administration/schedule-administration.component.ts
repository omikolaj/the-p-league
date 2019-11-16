import { SportTypeStateModel } from 'src/app/store/state/sport-type.state';
import { SportTypeState } from './../../../../store/state/sport-type.state';
import { Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { MatTabChangeEvent } from '@angular/material';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { TabTitles } from '../models/tab-titles.model';
import { ClearFormType } from '../models/clear-form-type.model';
import { NewScheduleComponent } from './new-schedule/new-schedule.component';
import { ModifyScheduleComponent } from './modify/modify-schedule.component';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { LeagueState } from 'src/app/store/state/league.state';

@Component({
  selector: 'app-schedule-administration',
  templateUrl: './schedule-administration.component.html',
  styleUrls: ['./schedule-administration.component.scss']
})
export class ScheduleAdministrationComponent implements OnInit {
  sportTypes$: Observable<SportType[]> = this.scheduleAdminFacade.sports$;
  @ViewChild('matGroup', { static: false }) matTabGroup;
  private _unsubscribe$ = new Subject<void>();
  tabTitle: TabTitles = 'Schedule';
  nextTab: 0 | 1 | 2 | number;
  newSportLeagueForm: FormGroup;
  newTeamForm: FormGroup;
  adminComponent: Type<NewScheduleComponent | ModifyScheduleComponent>;

  constructor(private fb: FormBuilder, private scheduleAdminFacade: ScheduleAdministrationFacade) {}

  //#region LifeCycle Hooks

  ngOnInit() {
    this.initForms();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  //#endregion

  checkSelection(): boolean {
    return this.scheduleAdminFacade.checkLeagueSelection();
  }

  //#region Forms

  initForms() {
    this.initNewSportAndLeagueForm();
    this.initNewTeamsForm();
  }

  initNewSportAndLeagueForm() {
    this.newSportLeagueForm = this.fb.group({
      sportType: this.fb.control(null, Validators.required),
      leagueName: this.fb.control(null),
      sportTypeID: this.fb.control(null)
    });
  }

  initNewTeamsForm() {
    this.newTeamForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      leagueID: this.fb.control(null, Validators.required)
    });
  }

  //#endregion

  //#region Event Handlers

  onUpdateSport(updatedSport: { id: string; name: string }) {
    const sportType: SportType = this.scheduleAdminFacade.store.selectSnapshot(SportTypeState.getSportTypeByID(updatedSport.id));
    const updatedSportType: SportType = {
      id: sportType.id,
      name: updatedSport.name
    };
    this.scheduleAdminFacade.updateSportType(updatedSportType);
  }

  onDeleteSport(id: string) {
    const leaguesForSportTypeToDelete: League[] = this.scheduleAdminFacade.store.selectSnapshot(LeagueState.getLeaguesForSportTypeID(id));
    if (leaguesForSportTypeToDelete.length > 0) {
      console.warn('Cannot delete sport type that has leagues assigned to it');
      return;
    }
    this.scheduleAdminFacade.deleteSportType(id);
  }

  onNewSportLeague(newSportLeague: FormGroup) {
    this.newSportLeagueForm.get('sportType').reset();
    this.newSportLeagueForm.get('leagueName').reset();
    this.newSportLeagueForm.get('sportTypeID').reset();

    const newSportAndOrLeague: { sportName: string; leagueName: string; sportTypeID: string } = {
      sportName: newSportLeague.get('sportType').value,
      leagueName: newSportLeague.get('leagueName').value,
      sportTypeID: newSportLeague.get('sportTypeID').value
    };

    // if we have sportTypeID were adding to existing sport type
    if (newSportAndOrLeague.sportTypeID) {
      if (newSportAndOrLeague.leagueName) {
        const newLeague: League = {
          name: newSportAndOrLeague.leagueName,
          sportTypeID: newSportAndOrLeague.sportTypeID
        };
        this.scheduleAdminFacade.addLeague(newLeague);
      }
    } else {
      // sanity check to ensure we have new sport name
      if (newSportAndOrLeague.sportName) {
        // if we are also adding a league with the sport
        const newSportType: SportType = {
          name: newSportAndOrLeague.sportName
        };
        // are we also adding new league?
        if (newSportAndOrLeague.leagueName) {
          const league: League = {
            name: newSportAndOrLeague.leagueName
          };
          this.scheduleAdminFacade.addSportAndLeague(newSportType, league);
        } else {
          this.scheduleAdminFacade.addSportType(newSportType);
        }
      }
    }
  }

  onNewTeam(newTeamForm: FormGroup) {
    this.newTeamForm.get('name').reset();
    this.newTeamForm.get('leagueID').reset();

    const newTeam: Team = {
      name: newTeamForm.get('name').value,
      leagueID: newTeamForm.get('leagueID').value,
      selected: true
    };

    this.scheduleAdminFacade.addTeam(newTeam);
  }

  onItemAdded(event) {
    console.log(event);
  }

  onNewSchedule() {
    // Update tab to 'New Schedule' and navigate to it
    this.tabTitle = 'New Schedule';
    this.nextTab = 1;
    this.adminComponent = NewScheduleComponent;
  }

  onPlayOffsSchedule() {
    this.tabTitle = 'Playoffs';
    this.nextTab = 1;
  }

  onModifySchedule() {
    this.tabTitle = 'Modify';
    this.nextTab = 1;
    this.adminComponent = ModifyScheduleComponent;
  }

  //#endregion

  checkExistingSchedule(): boolean {
    const isDisabled = this.checkSelection();
    if (!isDisabled) {
      return this.scheduleAdminFacade.checkExistingSchedule();
    }
    return isDisabled;
  }

  reset(event: MatTabChangeEvent) {
    this.nextTab = event.index;
  }
}
