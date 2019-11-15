import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { LeagueService } from 'src/app/core/services/schedule/schedule-administration/league/league.service';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { cloneDeep } from 'lodash';
import { EditLeagueControl } from '../../models/edit-league-control.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { MatSelectionListChange } from '@angular/material';
import { LeagueStateModel, LeagueState } from 'src/app/store/state/league.state';
import { Observable } from 'rxjs';
import { SportTypeState } from 'src/app/store/state/sport-type.state';
import { Select } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-league-administration',
  templateUrl: './league-administration.component.html',
  styleUrls: ['./league-administration.component.scss']
})
export class LeagueAdministrationComponent implements OnInit {
  leagues$: Observable<League[]>;
  @Input() sportTypeID: string;
  leagues: League[]; // currently not used
  @Input() sportType; // want to rid of this do not use
  @Output() deletedSport: EventEmitter<string> = new EventEmitter<string>();
  @Output() updatedSport: EventEmitter<SportType> = new EventEmitter<SportType>();

  editForm: FormGroup;
  sportTypeForm: FormGroup;
  readonlySportName: boolean = true;
  constructor(private fb: FormBuilder, private scheduleAdminFacade: ScheduleAdministrationFacade) {}

  //#region ng LifeCycle hooks

  ngOnInit() {
    this.leagues$ = this.scheduleAdminFacade.store.select(LeagueState.getAllLeaguesForSportTypeID).pipe(
      map(filterFn => {
        return (this.leagues = filterFn(this.sportTypeID));
      })
    );

    this.initForms();
  }

  ngOnDestroy() {
    console.log('destroying league admin');
  }

  //#endregion

  //#region Forms
  initForms() {
    this.initEditForm();
    this.initSportTypeForm();
  }

  initEditForm() {
    const leagueNameControls = this.sportType.leagues.map(l =>
      this.fb.group({
        name: this.fb.control(l.name, Validators.required),
        id: this.fb.control(l.id)
        // // controls initial value for readonly field
        // readonly: this.fb.control(true),
        // // controls initial value for rather the check box is selected or not
        // selected: this.fb.control(false),
        // sportTypeID: this.fb.control(this.sportType.id)
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
    // update sport type name
    const sportTypeClone = cloneDeep(this.sportType);
    sportTypeClone.name = this.sportTypeForm.get('name').value;
    this.updatedSport.emit(sportTypeClone);
  }

  onDeleteSportType() {
    this.deletedSport.emit(this.sportType.id);
  }

  //#endregion

  onLeagueSelectionChange(selectedLeaguesEvent: MatSelectionListChange) {
    const ids: string[] = [];
    for (let index = 0; index < selectedLeaguesEvent.source.selectedOptions.selected.length; index++) {
      const matListOption = selectedLeaguesEvent.source.selectedOptions.selected[index];
      ids.push(matListOption.value);
    }
    console.log('ids', ids);
    this.scheduleAdminFacade.updateSelectedLeagues(ids, this.sportTypeID);
  }

  //#region Event handlers

  /**
   * Event handler for when edit-leagues component emits
   * FormGroup with updated league names
   * @param  {FormGroup} updatedLeagueNames
   */
  onUpdatedLeagues(updatedLeagueNames: FormGroup) {
    const leaguesFormArray = updatedLeagueNames.get('leagues') as FormArray;
    const updatedLeagues: League[] = [];
    for (let index = 0; index < leaguesFormArray.length; index++) {
      const control = leaguesFormArray.at(index);
      if (this.leagues.some(l => l.id === control.value.id)) {
        const league = this.leagues.find(l => l.id === control.value.id);
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
    this.scheduleAdminFacade.deleteLeagues(this.sportTypeID);
  }

  //#endregion
}
