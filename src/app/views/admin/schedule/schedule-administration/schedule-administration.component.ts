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
      leagueName: this.fb.control(null)
    });
  }

  initNewTeamsForm() {
    this.newTeamForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      leagueName: this.fb.control(null, Validators.required)
    });
  }

  clearForm(formType: ClearFormType) {
    switch (formType) {
      case 'league':
        this.newSportLeagueForm.get('sportType').reset();
        this.newSportLeagueForm.get('leagueName').reset();
        break;
      case 'team':
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Event Handlers

  onUpdateSport(sportType: SportType) {
    this.scheduleAdminFacade.updateSportType(sportType);
  }

  onDeleteSport(id: string) {
    // check if sport contains leagues if so do not delete
    const sportTypeToDelete = this.scheduleAdminFacade.store.selectSnapshot<SportType>(SportTypeState.getSportTypeByID(id));
    if (sportTypeToDelete.leagues.length > 0) {
      console.warn('Cannot delete sport type that has leagues assigned to it');
      return;
    }
    this.scheduleAdminFacade.deleteSportType(id);
  }

  onNewSportLeague(newSportLeague: FormGroup) {
    this.clearForm('league');

    const newSportType: SportType = {
      name: newSportLeague.get('sportType').value,
      leagues: []
    };
    let newLeague: League = {
      name: newSportLeague.get('leagueName').value
    };

    if (newLeague.name) {
      newSportType.leagues.push(newLeague);
    }

    const sportTypes: SportType[] = this.scheduleAdminFacade.store.selectSnapshot(state => state.types.sports);
    // check if were adding to existing sport type
    const existingSport = sportTypes.find(s => s.name === newSportType.name);

    // means were adding new league to existing sport
    if (existingSport) {
      newLeague.sportTypeID = existingSport.id;
      //existingSport.leagues = [...existingSport.leagues, newLeague];
      this.scheduleAdminFacade.addLeague(newLeague);
    } else {
      this.scheduleAdminFacade.addSportType(newSportType);
    }
  }

  onNewTeam(newTeam: FormGroup) {}

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
