import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleContainerComponent } from '../schedule-container.component';
import { AdminScheduleDashboardComponent } from './admin-schedule-dashboard/admin-schedule-dashboard.component';
import { AdminScheduleRoutingModule } from './admin-schedule-routing.module';

@NgModule({
  declarations: [AdminScheduleDashboardComponent],
  imports: [
    CommonModule,
    AdminScheduleRoutingModule
  ],
})
export class AdminScheduleModule { }
