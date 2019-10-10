import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminControlComponent } from './admin-dashboard/admin-control/admin-control.component';
import { ScheduleAdministrationComponent } from './schedule/schedule-administration/schedule-administration.component';

@NgModule({
  declarations: [
      AdminLoginComponent, 
      AdminDashboardComponent, 
      AdminControlComponent, 
      ScheduleAdministrationComponent
    ],
  imports: [
      CommonModule, 
      ReactiveFormsModule, 
      SharedModule, 
      AdminRoutingModule
    ]
})
export class AdminModule {}
