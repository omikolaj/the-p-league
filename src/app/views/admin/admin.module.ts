import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CoreModule } from 'src/app/core/core.module';
import { AdminAuthGuard } from 'src/app/core/guards/admin/admin-auth.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeagueState } from 'src/app/shared/store/state/league.state';
import { ScheduleState } from 'src/app/shared/store/state/schedule.state';
import { SportTypeState } from 'src/app/shared/store/state/sport-type.state';
import { TeamState } from 'src/app/shared/store/state/team.state';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AddLeaguesComponent } from './components/add-sports-leagues/add-sports-leagues.component';
import { AddTeamsComponent } from './components/add-teams/add-teams.component';
import { AdminControlComponent } from './components/admin-control/admin-control.component';
import { UnassignedComponent } from './components/unassigned/unassigned.component';
import { EditLeaguesListComponent } from './schedule-administration/league-administration/edit-leagues-list/edit-leagues-list.component';
import { LeagueAdministrationComponent } from './schedule-administration/league-administration/league-administration.component';
import { ModifyMatchUpComponent } from './schedule-administration/modify/modify-match-up/modify-match-up.component';
import { ModifyScheduleComponent } from './schedule-administration/modify/modify-schedule.component';
import { EditTeamsListComponent } from './schedule-administration/new-schedule/edit-teams-list/edit-teams-list.component';
import { NewScheduleComponent } from './schedule-administration/new-schedule/new-schedule.component';
import { NewLeagueSessionScheduleComponent } from './schedule-administration/new-schedule/new-session-schedule/new-session-schedule.component';
import { PreviewScheduleComponent } from './schedule-administration/preview-schedule/preview-schedule.component';
import { ScheduleAdministrationComponent } from './schedule-administration/schedule-administration.component';

@NgModule({
	declarations: [
		AdminLoginComponent,
		AdminDashboardComponent,
		ScheduleAdministrationComponent,
		AdminControlComponent,
		LeagueAdministrationComponent,
		EditLeaguesListComponent,
		NewScheduleComponent,
		NewLeagueSessionScheduleComponent,
		EditTeamsListComponent,
		UnassignedComponent,
		AddTeamsComponent,
		AddLeaguesComponent,
		ModifyScheduleComponent,
		ModifyMatchUpComponent,
		PreviewScheduleComponent,
		NewScheduleComponent,
		ModifyScheduleComponent
	],
	entryComponents: [AdminControlComponent],
	imports: [
		NgxMaterialTimepickerModule,
		CommonModule,
		ReactiveFormsModule,
		SharedModule,
		CoreModule,
		AdminRoutingModule,
		NgxsModule.forFeature([SportTypeState, LeagueState, TeamState, ScheduleState])
	],
	providers: [AdminAuthGuard]
})
export class AdminModule {}
