import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { MatSelectionListChange } from '@angular/material';
import { LeagueState } from 'src/app/store/state/league.state';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-league-administration',
  templateUrl: './league-administration.component.html',
  styleUrls: ['./league-administration.component.scss']
})
export class LeagueAdministrationComponent implements OnInit {
  leagues$: Observable<League[]>;
  @Input() sportType: SportType;
  @Output() deletedSport: EventEmitter<string> = new EventEmitter<string>();
  @Output() updatedSportName: EventEmitter<{ id: string; name: string }> = new EventEmitter<{ id: string; name: string }>();

  editForm: FormGroup;
  sportTypeForm: FormGroup;
  readonlySportName: boolean = true;
  constructor(private fb: FormBuilder, private scheduleAdminFacade: ScheduleAdministrationFacade) {}

  //#region ng LifeCycle hooks

  ngOnInit() {
    this.leagues$ = this.scheduleAdminFacade.store.select(LeagueState.getAllLeaguesForSportTypeID).pipe(
      map(filterFn => filterFn(this.sportType.id)),
      tap(leagues => {
        this.initForms(leagues);
      })
    );
  }

  ngOnDestroy() {
    console.log('destroying league admin');
  }

  //#endregion

  //#region Forms
  initForms(leagues: League[]) {
    this.initEditForm(leagues);
    this.initSportTypeForm();
  }

  initEditForm(leagues: League[]) {
    const leagueNameControls = leagues.map(l =>
      this.fb.group({
        name: this.fb.control(l.name, Validators.required),
        id: this.fb.control(l.id)
      })
    );
    this.editForm = this.fb.group({
      leagues: this.fb.array(leagueNameControls)
    });
  }

  initSportTypeForm() {
    this.sportTypeForm = this.fb.group({
      name: this.fb.control(this.sportType.name)
    });
  }

  onSubmit() {
    this.readonlySportName ? this.onEditSportType() : this.onSaveSportType();
  }

  onEditSportType() {
    this.readonlySportName = !this.readonlySportName;
  }

  onSaveSportType() {
    this.readonlySportName = !this.readonlySportName;
    const updatedSport = {
      id: this.sportType.id,
      name: this.sportTypeForm.get('name').value
    };
    this.updatedSportName.emit(updatedSport);
  }

  onDeleteSportType() {
    this.deletedSport.emit(this.sportType.id);
  }

  //#endregion
  /**
   * @param  {MatSelectionListChange} selectedLeaguesEvent   *
   * Gets triggered each time user makes a list selection
   */
  onLeagueSelectionChange(selectedLeaguesEvent: MatSelectionListChange) {
    const ids: string[] = [];
    for (let index = 0; index < selectedLeaguesEvent.source.selectedOptions.selected.length; index++) {
      const matListOption = selectedLeaguesEvent.source.selectedOptions.selected[index];
      ids.push(matListOption.value);
    }
    this.scheduleAdminFacade.updateSelectedLeagues(ids, this.sportType.id);
  }

  //#region Event handlers

  /**
   * @param  {FormGroup} updatedLeagueNames
   * @param {League[]} leagues
   * Event handler for when edit-leagues component emits
   * FormGroup with updated league names
   */
  onUpdatedLeagues(updatedLeagueNames: FormGroup, leagues: League[]) {
    const leaguesFormArray = updatedLeagueNames.get('leagues') as FormArray;
    const updatedLeagues: League[] = [];
    for (let index = 0; index < leaguesFormArray.length; index++) {
      const control = leaguesFormArray.at(index);
      if (leagues.some(l => l.id === control.value.id)) {
        const league = leagues.find(l => l.id === control.value.id);
        if (league.name !== control.value.name) {
          updatedLeagues.push({
            id: control.value.id,
            name: control.value.name,
            sportTypeID: league.sportTypeID,
            selected: league.selected,
            readonly: league.readonly
          });
        }
      }
    }
    this.scheduleAdminFacade.updateLeagues(updatedLeagues);
  }

  /**
   * Event handler for when edit-leagues component emits
   * an array of league ids to be deleted
   */
  onDeletedLeagues() {
    this.scheduleAdminFacade.deleteLeagues(this.sportType.id);
  }

  //#endregion
}
