import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleListResolver } from 'src/app/core/resolvers/schedule/schedule-list.resolver';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';

const routes: Routes = [
	{
		path: '',
		resolve: [ScheduleListResolver],
		component: ScheduleListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ScheduleRoutingModule {}
