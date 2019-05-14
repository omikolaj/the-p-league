import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TeamSignupFormRoutingModule } from "./team-signup-form-routing.module";
import { TeamSignupFormComponent } from "./team-signup-form.component";
import {} from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [TeamSignupFormComponent],
  imports: [CommonModule, TeamSignupFormRoutingModule, SharedModule]
})
export class TeamSignupFormModule {}
