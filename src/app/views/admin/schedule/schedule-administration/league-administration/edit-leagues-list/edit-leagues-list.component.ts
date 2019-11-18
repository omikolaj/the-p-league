import { log } from 'util';
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, ViewChild, QueryList, EventEmitter, ViewChildren, OnDestroy, SimpleChanges } from '@angular/core';

import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

@Component({
  selector: 'app-edit-leagues-list',
  templateUrl: './edit-leagues-list.component.html',
  styleUrls: ['./edit-leagues-list.component.scss']
})
export class EditLeaguesListComponent implements OnInit, OnDestroy {
  @Input() editLeaguesForm: FormGroup;
  @Input() leagues: League[];
  @Output() selectedLeagues = new EventEmitter<MatSelectionListChange>();
  @Output() updatedLeagues = new EventEmitter<FormGroup>();
  @Output() deletedLeagues = new EventEmitter<void>();
  @ViewChild(MatSelectionList, { static: false }) leaguesList: MatSelectionList;

  disableListSelection: boolean = false;
  private numberOfSelectedLeagues: number = 0;
  get disableEdit(): boolean {
    return this.numberOfSelectedLeagues > 0 ? false : true;
  }
  get disableDelete(): boolean {
    const disable = this.numberOfSelectedLeagues > 0 ? false : true;
    return disable || this.disableListSelection;
  }

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    console.log('destroying edit leagues');
  }

  onSelectionChange(event: MatSelectionListChange) {
    this.numberOfSelectedLeagues = event.source.selectedOptions.selected.length;
    this.selectedLeagues.emit(event);
  }

  onSubmit() {
    this.disableListSelection ? this.onSave() : this.onEdit();
  }

  onEdit() {
    this.disableListSelection = !this.disableListSelection;
  }

  onSave() {
    this.disableListSelection = !this.disableListSelection;
    this.updatedLeagues.emit(this.editLeaguesForm);
  }

  onDelete() {
    this.numberOfSelectedLeagues = 0;
    this.deletedLeagues.emit();
  }

  trackByFn(index: number, league: League) {
    // there seems to be a bug with Angular
    // without trackByFn the view does not update correctly
    // DO NOT DELETE
    return index;
  }
}
