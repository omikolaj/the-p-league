import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Sport } from 'src/app/views/schedule/models/sport.enum';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AdminAdd } from '../../../models/admin-add-type.model';
import { ScheduleAdministrationService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration.service';
import { LeagueAdministrationService } from 'src/app/core/services/schedule/schedule-administration/league-administration/league-administration.service';
import { SelectedLeagues } from 'src/app/core/services/schedule/interfaces/selected-leagues.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { cloneDeep } from 'lodash';
import { EditLeagueControl } from '../../models/edit-league-control.model';

@Component({
  selector: 'app-league-administration',
  templateUrl: './league-administration.component.html',
  styleUrls: ['./league-administration.component.scss']
})
export class LeagueAdministrationComponent implements OnInit {
  @Input() sportType: SportType;
  @Output() deletedSport: EventEmitter<string> = new EventEmitter<string>();
  @Output() updatedSport: EventEmitter<SportType> = new EventEmitter<SportType>();

  editForm: FormGroup;
  sportTypeForm: FormGroup;
  readonlySportName: boolean = true;

  constructor(
    private leagueAdminService: LeagueAdministrationService,
    private fb: FormBuilder,
    private scheduleAdminService: ScheduleAdministrationService
  ) {}

  //#region ng LifeCycle hooks

  ngOnInit() {
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
        selected: this.fb.control(false)
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
    this.sportType.name = this.sportTypeForm.get('name').value;
    this.updatedSport.emit(this.sportType);
  }

  onDeleteSportType() {
    this.deletedSport.emit(this.sportType.id);
  }

  //#endregion

  onLeagueSelectionChange(selectedLeagueControls: EditLeagueControl[]) {
    const sportType: SportType = cloneDeep(this.sportType);
    const selectedLeagues = sportType.leagues.filter(s => selectedLeagueControls.some(c => c.id === s.id));
    sportType.leagues = selectedLeagues;
    this.leagueAdminService.onSelectedLeagues(sportType);
  }

  onUpdatedLeagues(updatedLeagueNames: FormGroup) {
    const sportTypeToUpdate = cloneDeep(this.sportType);
    const updated: EditLeagueControl[] = updatedLeagueNames.value.leagues as EditLeagueControl[];

    for (let index = 0; index < updated.length; index++) {
      const league = sportTypeToUpdate.leagues[index];
      const updatedLeague = updated.find(control => control.id === league.id);
      // map properties from user interface to existing objects to reflect changes
      league.name = updatedLeague.name;
      league.selected = updatedLeague.selected;
      league.readonly = updatedLeague.readonly;
    }
    this.scheduleAdminService.updateSportType(sportTypeToUpdate);
  }

  onDeletedLeagues(leagueIDsToDelete: string[]) {
    const sportTypeWithRemovedLeagues = cloneDeep(this.sportType);
    for (let index = 0; index < leagueIDsToDelete.length; index++) {
      const deleteID = leagueIDsToDelete[index];
      sportTypeWithRemovedLeagues.leagues = sportTypeWithRemovedLeagues.leagues.filter(l => l.id !== deleteID);
    }
    this.scheduleAdminService.updateSportType(sportTypeWithRemovedLeagues);
  }
}
