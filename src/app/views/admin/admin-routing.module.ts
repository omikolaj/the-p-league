import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/core/guards/admin/admin-auth.guard';
import { RolesResolver } from 'src/app/core/resolvers/roles/roles-resolver.resolver';
import { ScheduleListResolver } from 'src/app/core/resolvers/schedule/schedule-list.resolver';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ScheduleAdministrationComponent } from './schedule-administration/schedule-administration.component';
import { ScoreboardsComponent } from './scoreboards/scoreboards.component';

const routes: Routes = [
	{
		path: '',
		resolve: { roles: RolesResolver },
		children: [
			{
				path: 'login',
				component: AdminLoginComponent
			},
			{
				path: 'dashboard',
				component: AdminDashboardComponent,
				canActivate: [AdminAuthGuard]
			},
			{
				path: 'schedule',
				component: ScheduleAdministrationComponent,
				canActivate: [AdminAuthGuard],
				resolve: [ScheduleListResolver]
			},
			{
				path: 'scoreboards',
				component: ScoreboardsComponent,
				canActivate: [AdminAuthGuard]
			},
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full'
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule {}
