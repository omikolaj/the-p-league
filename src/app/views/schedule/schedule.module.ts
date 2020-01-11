import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ScheduleState } from 'src/app/shared/store/state/schedule.state';
import { SportTypeState } from 'src/app/shared/store/state/sport-type.state';
import { SharedModule } from './../../shared/shared.module';
import { LeagueState } from './../../shared/store/state/league.state';
import { TeamState } from './../../shared/store/state/team.state';
import { LeaguesSessionSchedulesComponent } from './leagues-session-schedules/leagues-session-schedules.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleRoutingModule } from './schedule-routing.module';

@NgModule({
	declarations: [ScheduleListComponent, LeaguesSessionSchedulesComponent],
	imports: [CommonModule, ScheduleRoutingModule, SharedModule, NgxsModule.forFeature([ScheduleState, SportTypeState, LeagueState, TeamState])]
})
export class ScheduleModule {}
