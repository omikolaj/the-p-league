import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamSignupRoutingModule } from './team-signup-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeamSignupFormComponent } from './team-signup-form/team-signup-form.component';
import { TeamSignupComponent } from './team-signup/team-signup.component';
import { InformationComponent } from './information/information.component';

@NgModule({
	declarations: [TeamSignupComponent, TeamSignupFormComponent, InformationComponent],
	imports: [CommonModule, TeamSignupRoutingModule, SharedModule]
})
export class TeamSignupModule {}
