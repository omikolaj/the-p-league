import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeagueState } from 'src/app/store/state/league.state';
import { SportTypeState } from 'src/app/store/state/sport-type.state';
import { TeamState } from 'src/app/store/state/team.state';
import { AdminControlComponent } from './admin-dashboard/admin-control/admin-control.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AddLeaguesComponent } from './schedule/components/add-leagues/add-leagues.component';
import { AddTeamsComponent } from './schedule/components/add-teams/add-teams.component';
import { AdminAddComponent } from './schedule/components/admin-add/admin-add.component';
import { UnassignedComponent } from './schedule/components/unassigned/unassigned.component';
import { EditLeaguesListComponent } from './schedule/schedule-administration/league-administration/edit-leagues-list/edit-leagues-list.component';
import { LeagueAdministrationComponent } from './schedule/schedule-administration/league-administration/league-administration.component';
import { ModifyMatchUpComponent } from './schedule/schedule-administration/modify/modify-match-up/modify-match-up.component';
import { ModifyScheduleComponent } from './schedule/schedule-administration/modify/modify-schedule.component';
import { EditTeamsListComponent } from './schedule/schedule-administration/new-schedule/edit-teams-list/edit-teams-list.component';
import { NewScheduleComponent } from './schedule/schedule-administration/new-schedule/new-schedule.component';
import { NewLeagueSessionScheduleComponent } from './schedule/schedule-administration/new-schedule/new-session-schedule/new-session-schedule.component';
import { PreviewScheduleComponent } from './schedule/schedule-administration/new-schedule/preview-schedule/preview-schedule.component';
import { ScheduleAdministrationComponent } from './schedule/schedule-administration/schedule-administration.component';

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
		NgxsModule.forFeature([SportTypeState, LeagueState, TeamState])
	],
	providers: [AdminAuthGuard]
})
export class AdminModule {}
