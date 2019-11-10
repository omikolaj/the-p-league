import { cloneDeep } from 'lodash';
import { FormGroup, FormBuilder, Validators, FormGroupDirective, FormControl, FormControlName } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { LeagueService } from 'src/app/core/services/schedule/schedule-administration/league/league.service';
import { EmitEvent } from 'src/app/core/services/event-bus/EmitEvent';
import { MatAccordion, MatExpansionPanelState, MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-add-leagues',
  templateUrl: './add-leagues.component.html',
  styleUrls: ['./add-leagues.component.scss']
})
export class AddLeaguesComponent {
  title: string = 'Add';
  description: string = 'Sport/League';
  @Input() newSportLeagueForm: FormGroup;
  @Input() sportTypes: SportType[];
  @Output() onNewSportLeague: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @ViewChild(MatExpansionPanel, { static: false })
  matExpansionPanel: MatExpansionPanel;

  constructor() {}

  onSubmit(formGroupDirective: FormGroupDirective) {
    const newSportLeague = cloneDeep(this.newSportLeagueForm);
    // necessary to reset validations
    formGroupDirective.resetForm();

    this.onNewSportLeague.emit(newSportLeague);
    // collapse the expansion panel
    this.matExpansionPanel.close();
  }
}
