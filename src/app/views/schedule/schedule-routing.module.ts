import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleContainerComponent } from './schedule-container.component';

const routes: Routes = [
	{
		path: '',
		component: ScheduleContainerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ScheduleRoutingModule {}
