import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamSignupComponent } from './team-signup/team-signup.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signup',
        component: TeamSignupComponent,
        data: { animation: 'TeamSignUpPage' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamSignupRoutingModule {}
