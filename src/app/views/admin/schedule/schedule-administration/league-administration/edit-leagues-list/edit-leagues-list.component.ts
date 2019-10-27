import { EditLeagueControl } from "./../../../models/edit-league-control.model";
import { LeaguesListComponent } from "./../../../../../schedule/leagues/leagues-list.component";
import { FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  QueryList,
  EventEmitter,
  ViewChildren
} from "@angular/core";
import { League } from "src/app/views/schedule/models/interfaces/League.model";
import { ScheduleAdministrationService } from "src/app/core/services/schedule/schedule-administration/schedule-administration.service";

import { SelectionModel } from "@angular/cdk/collections";
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange
} from "@angular/material";
import { SportType } from "src/app/views/schedule/models/interfaces/sport-type.model";
import { SelectedLeagues } from "src/app/core/services/schedule/interfaces/selected-leagues.model";
import { cloneDeep } from "lodash";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-edit-leagues-list",
  templateUrl: "./edit-leagues-list.component.html",
  styleUrls: ["./edit-leagues-list.component.scss"]
})
export class EditLeaguesListComponent implements OnInit {
  @Input() editLeaguesForm: FormGroup;
  @Output() selectedLeagues = new EventEmitter<EditLeagueControl[]>();
  @Output() updatedLeagues = new EventEmitter<FormGroup>();
  @ViewChild(MatSelectionList, { static: false }) leaguesList: MatSelectionList;
  @ViewChildren(MatListOption) listOfLeagues: QueryList<MatListOption>;

  disableListSelection: boolean = false;
  leagues: EditLeagueControl[] = [];

  constructor() {}

  ngOnInit() {
    this.leagues = this.editLeaguesForm.value.leagues as EditLeagueControl[];
  }

  onSelectionChange(event: MatSelectionListChange) {
    const selectedLeagueControls: EditLeagueControl[] = [];
    for (
      let index = 0;
      index < event.source.selectedOptions.selected.length;
      index++
    ) {
      const id = event.source.selectedOptions.selected[index].value;
      selectedLeagueControls.push(this.leagues.find(l => l.id === id));
    }
    this.selectedLeagues.emit(selectedLeagueControls);
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

  // perhaps this should be a service methods?
  editLeagues(leagueIDs: string[]) {
    // store selected options
    const leagues = this.editLeaguesForm.get("leagues") as FormArray;
    for (let index = 0; index < leagueIDs.length; index++) {
      const league = leagues.at(index);
      if (leagueIDs.some(id => league.value.id === id)) {
        league.patchValue({
          readonly: !league.value.readonly,
          selected: true
        });
      }
    }
    this.leagues = [...leagues.value];
  }

  findSelectedLeagueIDs(): string[] {
    const selectedLeagueIDs: string[] = [];
    for (
      let index = 0;
      index < this.leaguesList.selectedOptions.selected.length;
      index++
    ) {
      const selectedLeagueID = this.leaguesList.selectedOptions.selected[index]
        .value;
      selectedLeagueIDs.push(selectedLeagueID);
    }
    return selectedLeagueIDs;
  }
}
