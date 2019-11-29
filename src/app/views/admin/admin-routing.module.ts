import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ScheduleAdministrationComponent } from './schedule/schedule-administration/schedule-administration.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { RolesResolver } from 'src/app/core/services/resolvers/roles/roles-resolver.resolver';
import { ScheduleAdministrationResolver } from 'src/app/core/services/resolvers/schedule/schedule-administration-resolver.resolver';

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
				resolve: [ScheduleAdministrationResolver]
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
