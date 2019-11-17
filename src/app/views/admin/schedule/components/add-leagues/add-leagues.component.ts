import { cloneDeep } from 'lodash';
import { FormGroup, FormBuilder, Validators, FormGroupDirective, FormControl, FormControlName } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { LeagueService } from 'src/app/core/services/schedule/schedule-administration/league/league.service';
import { EmitEvent } from 'src/app/core/services/event-bus/EmitEvent';
import { MatAccordion, MatExpansionPanelState, MatExpansionPanel, MatAutocomplete, MatOption, MatAutocompleteSelectedEvent } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { SportTypesLeaguesPairs } from '../../models/sport-types-leagues-pairs.model';

@Component({
  selector: 'app-add-leagues',
  templateUrl: './add-leagues.component.html',
  styleUrls: ['./add-leagues.component.scss']
})
export class AddLeaguesComponent {
  title: string = 'Add';
  description: string = 'Sport/League';
  @Input() newSportLeagueForm: FormGroup;
  @Input() sportLeaguePairs: SportTypesLeaguesPairs[];
  @Output() onNewSportLeague: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @ViewChild(MatExpansionPanel, { static: false }) matExpansionPanel: MatExpansionPanel;
  @ViewChild('auto', { static: false }) autoComplete: MatAutocomplete;
  private unsubscribe$ = new Subject<void>();
  private selectedSport: MatAutocompleteSelectedEvent;

  constructor() {}

  ngAfterViewInit() {
    this.autoComplete.optionSelected
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((selected: MatAutocompleteSelectedEvent) => selected !== undefined),
        tap(selected => (this.selectedSport = selected))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(formGroupDirective: FormGroupDirective) {
    this.addSportTypeIDIfExists();
    const newSportLeague = cloneDeep(this.newSportLeagueForm);
    // necessary to reset validations
    formGroupDirective.resetForm();

    this.onNewSportLeague.emit(newSportLeague);
    // collapse the expansion panel
    this.matExpansionPanel.close();
    // clear any selected sport from memory
    this.selectedSport = undefined;
  }

  displayFn(pair?: SportTypesLeaguesPairs) {
    return pair ? pair.sportName : undefined;
  }

  private addSportTypeIDIfExists() {
    if (this.selectedSport) {
      const pair: SportTypesLeaguesPairs = this.selectedSport.option.value as SportTypesLeaguesPairs;
      this.newSportLeagueForm.get('sportTypeID').setValue(pair.sportID);
    }
  }
}
