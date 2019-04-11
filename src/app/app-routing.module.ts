import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamSignupFormComponent } from './static/team-signup-form/team-signup-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'about'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
