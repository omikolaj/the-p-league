import { MatSelectionListChange, MatSelectionList } from '@angular/material';
import { SportType } from '../../../../../schedule/models/interfaces/sport-type.model';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

@Component({
  selector: 'app-edit-teams-list',
  templateUrl: './edit-teams-list.component.html',
  styleUrls: ['./edit-teams-list.component.scss']
})
export class EditTeamsListComponent implements OnInit {
  @Input() teamsForm: FormGroup;
  @Input() teams: Team[];
  @Input() league: League;
  @Output() onUnassignTeams: EventEmitter<void> = new EventEmitter<void>();
  @Output() onUpdateTeams: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onDeleteTeams: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSelectionChange: EventEmitter<MatSelectionListChange> = new EventEmitter<MatSelectionListChange>();
  disableListSelection: boolean = false;
  // assumes we have at least one team selected when initialized
  private numberOfSelectedTeams: number = 1;
  get disableEdit(): boolean {
    return this.numberOfSelectedTeams > 0 ? false : true;
  }
  get disableDelete(): boolean {
    const disable = this.numberOfSelectedTeams > 0 ? false : true;
    return disable || this.disableListSelection;
  }
  @ViewChild(MatSelectionList, { static: false }) teamList: MatSelectionList;

  constructor() {}

  //#region ng LifeCycle Hooks

  ngOnInit() {}

  //#endregion

  onTeamSelectionChange(event: MatSelectionListChange) {
    this.numberOfSelectedTeams = event.source.selectedOptions.selected.length;
    this.onSelectionChange.emit(event);
  }

  onSubmit() {
    this.disableListSelection ? this.onSaveHandler() : this.onEditHandler();
  }

  onUnassignHandler() {
    this.onUnassignTeams.emit();
  }

  onEditHandler() {
    this.disableListSelection = !this.disableListSelection;
  }

  onSaveHandler() {
    this.disableListSelection = !this.disableListSelection;
    this.onUpdateTeams.emit(this.teamsForm);
  }

  onDeleteHandler() {
    this.numberOfSelectedTeams = 0;
    this.onDeleteTeams.emit();
  }
}
