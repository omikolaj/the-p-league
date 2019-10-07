import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminScheduleDashboardComponent } from './admin-schedule-dashboard/admin-schedule-dashboard.component';


const routes: Routes = [
  { 
    path: '',
    component: AdminScheduleDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminScheduleRoutingModule { }
