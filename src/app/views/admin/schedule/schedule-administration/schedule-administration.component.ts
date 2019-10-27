import { Observable, Subject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Sport } from 'src/app/views/schedule/models/sport.enum';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { AdminAdd } from '../../models/admin-add-type.model';
import { ActivatedRoute } from '@angular/router';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration.service';
import { TabTitles } from '../models/tab-titles.model';
import { LeagueAdministrationService } from 'src/app/core/services/schedule/schedule-administration/league-administration/league-administration.service';
import { calendarFormat } from 'moment';
import { startWith, map, flatMap, switchMap, tap, takeUntil } from 'rxjs/operators';
import { ClearFormType } from '../models/clear-form-type.model';

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
  private _unsubscribe$ = new Subject<void>();

  @ViewChild('matGroup', { static: false }) matTabGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private scheduleAdminService: ScheduleAdministrationService,
    private leagueAdminService: LeagueAdministrationService
  ) {}

  ngOnInit() {
    this.initForms();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  checkSelection(): boolean {
    return this.scheduleAdminService.checkLeagueSelection();
  }

  initForms() {
    this.sports$.pipe(takeUntil(this._unsubscribe$)).subscribe(sportTypes => {
      this.initNewSportAndLeagueForm(sportTypes);
      this.initNewTeamsForm(sportTypes);
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

  initNewTeamsForm(sportTypes) {}

  onNewSportLeague(newSportLeague: FormGroup) {
    this.clearForm('league');
    const newSportType: SportType = {
      name: newSportLeague.get('sportType').value,
      leagues: [
        {
          name: newSportLeague.get('leagueName').value
        }
      ]
    };
    this.scheduleAdminService.addSport(newSportType);
  }

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

  onItemAdded(event) {
    console.log(event);
  }

  onNewSchedule() {
    // Update tab to 'New Schedule' and navigate to it
    this.tabTitle = 'New Schedule';
    this.nextTab = 1;
    console.log(this.matTabGroup);
  }

  onPlayOffsSchedule() {
    //TODO filter list of leagues to selected ones
    this.tabTitle = 'Playoffs';
    this.nextTab = 1;
  }

  onModifySchedule() {
    //TODO filter list of leagues to selected ones
    this.tabTitle = 'Modify';
    this.nextTab = 1;
  }
}
