import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ScheduleAdministrationComponent } from './schedule/schedule-administration/schedule-administration.component';
import { CanActivate } from '@angular/router/src/utils/preactivation';

const routes: Routes = [
    { path: '', children: [ 
        {
          path: 'login',
          component: AdminLoginComponent,
          // canActivate:  
        },       
        {
          path: 'dashboard',
          component: AdminDashboardComponent,
          canActivate: [AdminAuthGuard] 
        },
        {
          path: 'schedule',
          component: ScheduleAdministrationComponent
          // canActivate:  
        },        
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        }       
      ] 
    },
    
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
