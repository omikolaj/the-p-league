import { log } from 'util';
import { EditLeagueControl } from './../../../models/edit-league-control.model';
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, ViewChild, QueryList, EventEmitter, ViewChildren } from '@angular/core';

import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

@Component({
  selector: 'app-edit-leagues-list',
  templateUrl: './edit-leagues-list.component.html',
  styleUrls: ['./edit-leagues-list.component.scss']
})
export class EditLeaguesListComponent implements OnInit {
  @Output() selectedLeagues = new EventEmitter<MatSelectionListChange>();
  @Output() updatedLeagues = new EventEmitter<FormGroup>();
  @Output() deletedLeagues = new EventEmitter<string[]>();
  @ViewChild(MatSelectionList, { static: false }) leaguesList: MatSelectionList;

  private _editLeaguesForm: FormGroup;
  @Input()
  set editLeaguesForm(value) {
    if (!this._editLeaguesForm) {
      this._editLeaguesForm = value;
    }
  }
  get editLeaguesForm() {
    return this._editLeaguesForm;
  }

  get disableEdit(): boolean {
    return this.numberOfSelectedLeagues > 0 ? false : true;
  }
  get disableDelete(): boolean {
    const disable = this.numberOfSelectedLeagues > 0 ? false : true;
    return disable || this.disableListSelection;
  }

  private numberOfSelectedLeagues: number = 0;
  disableListSelection: boolean = false;
  leagues: EditLeagueControl[] = [];

  constructor() {}

  ngOnInit() {
    this.leagues = [...(this.editLeaguesForm.value.leagues as Array<EditLeagueControl>)];
  }
  ngOnDestroy() {
    console.log('destroying edit leagues');
  }

  onSelectionChange(event: MatSelectionListChange) {
    this.numberOfSelectedLeagues = event.source.selectedOptions.selected.length;
    // const selectedLeagueControls: League[] = [];
    // for (let index = 0; index < this.numberOfSelectedLeagues; index++) {
    //   const id = event.source.selectedOptions.selected[index].value;
    //   selectedLeagueControls.push(this.leagues.find(l => l.id === id));
    // }
    this.selectedLeagues.emit(event);
  }

  onSubmit() {
    this.disableListSelection ? this.onSave() : this.onEdit();
  }

  onEdit() {
    // disable list selection until we hit save
    this.disableListSelection = !this.disableListSelection;
    // find the id of selected leagues
    const selectedIds = this.findSelectedLeagueIDs();
    this.editLeagues(selectedIds);
  }

  onSave() {
    this.disableListSelection = !this.disableListSelection;
    const selectedIds = this.findSelectedLeagueIDs();
    this.editLeagues(selectedIds);
    this.updatedLeagues.emit(this.editLeaguesForm);
  }

  onDelete() {
    const selectedIds = this.findSelectedLeagueIDs();
    this.deletedLeagues.emit(selectedIds);
  }

  // perhaps this should be a service methods?
  editLeagues(leagueIDs: string[]) {
    // store selected options
    const leagues = this.editLeaguesForm.get('leagues') as FormArray;

    for (let index = 0; index < leagues.value.length; index++) {
      const league = leagues.at(index);
      if (leagueIDs.some(id => id === (league.value as EditLeagueControl).id)) {
        const league = leagues.at(index);
        league.patchValue({
          readonly: !league.value.readonly,
          selected: true
        });
      }
    }
    this.editLeaguesForm.updateValueAndValidity();
    this.leagues = [...leagues.value];
  }

  findSelectedLeagueIDs(): string[] {
    const selectedLeagueIDs: string[] = [];
    for (let index = 0; index < this.leaguesList.selectedOptions.selected.length; index++) {
      const selectedLeagueID = this.leaguesList.selectedOptions.selected[index].value;
      selectedLeagueIDs.push(selectedLeagueID);
    }
    return selectedLeagueIDs;
  }
}
