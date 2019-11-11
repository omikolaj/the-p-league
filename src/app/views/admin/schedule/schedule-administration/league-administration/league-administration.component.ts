import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-league-administration',
  templateUrl: './league-administration.component.html',
  styleUrls: ['./league-administration.component.scss']
})
export class LeagueAdministrationComponent implements OnInit {
  leagues$: Observable<League[]>;
  @Input() sportTypeID: string;
  @Input() sportType;
  @Output() deletedSport: EventEmitter<string> = new EventEmitter<string>();
  @Output() updatedSport: EventEmitter<SportType> = new EventEmitter<SportType>();

  editForm: FormGroup;
  sportTypeForm: FormGroup;
  readonlySportName: boolean = true;
  constructor(private fb: FormBuilder, private scheduleAdminFacade: ScheduleAdministrationFacade) {}

  //#region ng LifeCycle hooks

  ngOnInit() {
    this.leagues$ = this.scheduleAdminFacade.store.select(LeagueState.getAllLeaguesForSportTypeID).pipe(map(filterFn => filterFn(this.sportTypeID)));
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
        id: this.fb.control(l.id),
        // controls initial value for readonly field
        readonly: this.fb.control(true),
        // controls initial value for rather the check box is selected or not
        selected: this.fb.control(false),
        sportTypeID: this.fb.control(this.sportType.id)
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
    this.scheduleAdminFacade.updateSelectedLeaguesForSportTypeID(selectedLeaguesEvent.source.selectedOptions.selected, this.sportType.id);
  }

  //#region Event handlers

  /**
   * Event handler for when edit-leagues component emits
   * FormGroup with updated league names
   * @param  {FormGroup} updatedLeagueNames
   */
  onUpdatedLeagues(updatedLeagueNames: FormGroup) {
    const sportTypeToUpdate = cloneDeep(this.sportType);
    const updated: EditLeagueControl[] = updatedLeagueNames.value.leagues as EditLeagueControl[];
    const updatedLeagues: League[] = [];
    for (let index = 0; index < updated.length; index++) {
      const league = sportTypeToUpdate.leagues[index];
      const updatedLeague = updated.find(control => control.id === league.id);
      // map properties from user interface to existing objects to reflect changes
      league.name = updatedLeague.name;
      league.selected = updatedLeague.selected;
      league.readonly = updatedLeague.readonly;
      updatedLeagues.push(league);
    }

    this.scheduleAdminFacade.updateLeagues(updatedLeagues);
  }

  /**
   * Event handler for when edit-leagues component emits
   * an array of league ids to be deleted
   * @param  {string[]} leagueIDsToDelete
   */
  onDeletedLeagues(leagueIDsToDelete: string[]) {
    // const sportTypeWithRemovedLeagues = cloneDeep(this.sportType);
    // for (let index = 0; index < leagueIDsToDelete.length; index++) {
    //   const deleteID = leagueIDsToDelete[index];
    //   sportTypeWithRemovedLeagues.leagues = sportTypeWithRemovedLeagues.leagues.filter(l => l.id !== deleteID);
    // }
    this.scheduleAdminFacade.deleteLeagues(leagueIDsToDelete);
  }

  //#endregion
}
