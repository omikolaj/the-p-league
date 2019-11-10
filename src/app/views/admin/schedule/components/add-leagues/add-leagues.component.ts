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
export class AddLeaguesComponent implements OnInit {
  title: string = 'Add';
  description: string = 'Sport/League';
  @Input() newSportLeagueForm: FormGroup;
  @Input() sportTypes: SportType[];
  @Output() onNewSportLeague: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @ViewChild(MatExpansionPanel, { static: false })
  matExpansionPanel: MatExpansionPanel;
  sportNames: any[] = [];

  constructor() {}

  ngOnInit() {
    // sport names are coming in as a FormArray data,
    // because reseting form validations requires a resetForm() call
    // this would also clear the list of sportNames
    // instead we are saving it in a local variable and saving it for the future
    //this.sportNames = [...this.newSportLeagueForm.get('sportNames').value];
  }

  onSubmit(formGroupDirective: FormGroupDirective) {
    const newSportLeague = cloneDeep(this.newSportLeagueForm);
    // necessary to reset validations
    formGroupDirective.resetForm();

    this.onNewSportLeague.emit(newSportLeague);
    // collapse the expansion panel
    this.matExpansionPanel.close();
  }
}
