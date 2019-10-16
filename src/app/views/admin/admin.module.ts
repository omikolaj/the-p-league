import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminControlComponent } from './admin-dashboard/admin-control/admin-control.component';
import { ScheduleAdministrationComponent } from './schedule/schedule-administration/schedule-administration.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { CoreModule } from 'src/app/core/core.module';
import { LeagueAdministrationComponent } from './schedule/league-administration/league-administration.component';
import { SessionAdministrationComponent } from './schedule/session-administration/session-administration.component';

@NgModule({
  declarations: [
      AdminLoginComponent, 
      AdminDashboardComponent,       
      ScheduleAdministrationComponent,
      AdminControlComponent,
      LeagueAdministrationComponent,
      SessionAdministrationComponent
    ],
    entryComponents: [
      AdminControlComponent
    ],
  imports: [
      CommonModule, 
      ReactiveFormsModule, 
      SharedModule, 
      CoreModule,
      AdminRoutingModule
    ],
    providers: [
      AdminAuthGuard      
    ]
})
export class AdminModule {}
