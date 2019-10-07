import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleContainerComponent } from './schedule-container.component';
import { AdminScheduleDashboardComponent } from './admin/admin-schedule-dashboard/admin-schedule-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleContainerComponent
  },
  {
    path: 'admin',
    loadChildren: './admin/admin-schedule.module#AdminScheduleModule'        
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
