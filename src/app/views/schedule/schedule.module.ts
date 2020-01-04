import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { LeaguesSessionSchedulesComponent } from './leagues-session-schedules/leagues-session-schedules.component';
import { SessionSchedulesComponent } from './leagues-session-schedules/session-schedules/session-schedules.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleRoutingModule } from './schedule-routing.module';

@NgModule({
	declarations: [ScheduleListComponent, LeaguesSessionSchedulesComponent, SessionSchedulesComponent],
	imports: [CommonModule, ScheduleRoutingModule, SharedModule]
})
export class ScheduleModule {}
