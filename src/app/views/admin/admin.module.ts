import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminControlComponent } from './admin-dashboard/admin-control/admin-control.component';
import { ScheduleAdministrationComponent } from './schedule/schedule-administration/schedule-administration.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { CoreModule } from 'src/app/core/core.module';
import { LeagueAdministrationComponent } from './schedule/schedule-administration/league-administration/league-administration.component';
import { AdminAddComponent } from './schedule/components/admin-add/admin-add.component';
import { EditLeaguesListComponent } from './schedule/schedule-administration/league-administration/edit-leagues-list/edit-leagues-list.component';
import { NewScheduleComponent } from './schedule/schedule-administration/new-schedule/new-schedule.component';
import { NewSessionScheduleComponent } from './schedule/schedule-administration/new-schedule/new-session-schedule/new-session-schedule.component';
import { EditTeamsListComponent } from './schedule/schedule-administration/new-schedule/team-administration/edit-teams-list/edit-teams-list.component';
import { UnassignedComponent } from './schedule/components/unassigned/unassigned.component';
import { AddTeamsComponent } from './schedule/components/add-teams/add-teams.component';
import { AddLeaguesComponent } from './schedule/components/add-leagues/add-leagues.component';
import { TeamAdministrationComponent } from './schedule/schedule-administration/new-schedule/team-administration/team-administration.component';
import { ModifyScheduleComponent } from './schedule/schedule-administration/modify/modify-schedule.component';
import { ModifyMatchUpComponent } from './schedule/schedule-administration/modify/modify-match-up/modify-match-up.component';
import { NgxsModule } from '@ngxs/store';
import { SportTypeState } from 'src/app/store/state/sport-type.state';
import { LeagueState } from 'src/app/store/state/league.state';
import { TeamState } from 'src/app/store/state/team.state';

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminDashboardComponent,
    ScheduleAdministrationComponent,
    AdminControlComponent,
    LeagueAdministrationComponent,
    AdminAddComponent,
    EditLeaguesListComponent,
    NewScheduleComponent,
    NewSessionScheduleComponent,
    EditTeamsListComponent,
    UnassignedComponent,
    AddTeamsComponent,
    AddLeaguesComponent,
    TeamAdministrationComponent,
    ModifyScheduleComponent,
    ModifyMatchUpComponent
  ],
  entryComponents: [AdminControlComponent, NewScheduleComponent, ModifyScheduleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    AdminRoutingModule,
    NgxsModule.forFeature([SportTypeState, LeagueState, TeamState])
  ],
  providers: [AdminAuthGuard]
})
export class AdminModule {}
