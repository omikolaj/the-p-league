import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleContainerComponent } from './schedule-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeaguesListComponent } from './leagues/leagues-list.component';
import { LeagueComponent } from './leagues/league/league.component';
import { LeagueScheduleComponent } from './leagues/league/league-schedule/league-schedule.component';

@NgModule({
  declarations: [ScheduleContainerComponent, LeaguesListComponent, LeagueComponent, LeagueScheduleComponent],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    SharedModule     
  ]
})
export class ScheduleModule { }
