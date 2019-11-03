import { Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { MatTabChangeEvent } from '@angular/material';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration.service';
import { TabTitles } from '../models/tab-titles.model';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ClearFormType } from '../models/clear-form-type.model';
import { NewScheduleComponent } from './new-schedule/new-schedule.component';
import { ModifyScheduleComponent } from './modify/modify-schedule.component';
import { SportTypeState } from 'src/app/store/state/sport-type.state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-schedule-administration',
  templateUrl: './schedule-administration.component.html',
  styleUrls: ['./schedule-administration.component.scss']
})
export class ScheduleAdministrationComponent implements OnInit {
  leagues: League[] = [];
  //sports: SportType[] = [];
  tabTitle: TabTitles = 'Schedule';
  nextTab: 0 | 1 | 2 | number;
  newSportLeagueForm: FormGroup;
  newTeamForm: FormGroup;
  sports$: Observable<SportType[]> = this.scheduleAdminService.sportTypes$;
  sportTypes: SportType[];

  adminComponent: Type<NewScheduleComponent | ModifyScheduleComponent>;

  @Select(SportTypeState) sportTypes$: Observable<SportType[]>;

  private _unsubscribe$ = new Subject<void>();

  @ViewChild('matGroup', { static: false }) matTabGroup;

  constructor(private fb: FormBuilder, private scheduleAdminService: ScheduleAdministrationService) {}

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
    return this.scheduleAdminService.checkLeagueSelection();
  }

  //#region Forms

  initForms() {
    this.sports$.pipe(takeUntil(this._unsubscribe$)).subscribe(sportTypes => {
      this.initNewSportAndLeagueForm(sportTypes);
      this.initNewTeamsForm();
    });
  }

  initNewSportAndLeagueForm(sportTypes) {
    const sportNameControls = sportTypes.map(s =>
      this.fb.group({
        name: this.fb.control(s.name)
      })
    );
    this.newSportLeagueForm = this.fb.group({
      sportType: this.fb.control(null, Validators.required),
      leagueName: this.fb.control(null),
      sportNames: this.fb.array([...sportNameControls])
    });
  }

  initNewTeamsForm() {}

  clearForm(formType: ClearFormType) {
    switch (formType) {
      case 'league':
        this.newSportLeagueForm.get('sportType').reset();
        let sportNames = [];
        this.sports$.pipe(
          switchMap(s =>
            s.map(sportType => {
              return {
                name: sportType.name
              };
            })
          )
        );
        this.newSportLeagueForm.get('sportNames').patchValue(sportNames);
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
    this.scheduleAdminService.updateSportType(sportType);
  }

  onDeleteSport(id: string) {
    this.scheduleAdminService.deleteSportType(id);
  }

  onNewSportLeague(newSportLeague: FormGroup) {
    this.clearForm('league');
    // leagues array has to be initialized
    const newSportType: SportType = {
      name: newSportLeague.get('sportType').value,
      leagues: []
    };
    // check if we are adding a league if so add id temporary
    const newLeagueName = newSportLeague.get('leagueName').value;
    if (newLeagueName) {
      const newLeagueID = (Math.floor(Math.random() * 100) + 1).toString();
      newSportType.leagues.push({ name: newLeagueName, id: newLeagueID });
    }
    this.scheduleAdminService.addSport(newSportType);
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
      return this.scheduleAdminService.checkExistingSchedule();
    }
    return isDisabled;
  }

  reset(event: MatTabChangeEvent) {
    this.nextTab = event.index;
  }
}
