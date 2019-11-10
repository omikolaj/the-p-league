import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';

import { TabTitles } from '../../models/tab-titles.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-schedule',
  templateUrl: './new-schedule.component.html',
  styleUrls: ['./new-schedule.component.scss']
})
export class NewScheduleComponent implements OnInit {
  tab: TabTitles = 'New Schedule';
  unassignedTeams: Team[] = [];
  leagues$: Observable<League[]> = this.scheduleAdminFacade.selectedLeagues$;

  constructor(private scheduleAdminFacade: ScheduleAdministrationFacade) {}

  ngOnInit() {}
}
