import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/core/guards/admin/admin-auth.guard';
import { RolesResolver } from 'src/app/core/resolvers/roles/roles-resolver.resolver';
import { ScheduleAdministrationResolver } from 'src/app/core/resolvers/schedule/schedule-administration-resolver.resolver';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ScheduleAdministrationComponent } from './schedule-administration/schedule-administration.component';

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
