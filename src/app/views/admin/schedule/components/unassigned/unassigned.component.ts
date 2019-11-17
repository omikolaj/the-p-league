import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { LeagueService } from 'src/app/core/services/schedule/schedule-administration/league/league.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { SportTypesLeaguesPairs } from '../../models/sport-types-leagues-pairs.model';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-unassigned',
  templateUrl: './unassigned.component.html',
  styleUrls: ['./unassigned.component.scss']
})
export class UnassignedComponent implements OnInit {
  @Input('teams') unassignedTeams: Team[];
  @Input() sportLeaguePairs: SportTypesLeaguesPairs[];
  @Input() assignTeamsForm: FormGroup;
  @Output() onAssignTeamsToLeagues: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  constructor() {}

  ngOnInit() {}

  onSelectionChange() {
    // remove any form group control that does not have league selected
  }

  onSubmit(formGroup: FormGroupDirective) {
    this.onAssignTeamsToLeagues.emit(this.assignTeamsForm);
  }
}
