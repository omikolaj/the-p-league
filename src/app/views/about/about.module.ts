import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutRoutingModule } from "./about-routing.module";
import { AboutComponent } from "./about.component";

import { CoreModule } from "src/app/core/core.module";
import { SharedModule } from "src/app/shared/shared.module";
import { TeamSignupComponent } from "./components/team-signup/team-signup/team-signup.component";
import { TeamSignupModule } from "./components/team-signup/team-signup.module";

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    TeamSignupModule,
    CoreModule,
    SharedModule
  ]
})
export class AboutModule {}
