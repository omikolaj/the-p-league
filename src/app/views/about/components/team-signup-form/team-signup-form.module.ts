import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TeamSignupFormRoutingModule } from "./team-signup-form-routing.module";
import { TeamSignupFormComponent } from "./team-signup-form.component";
import { SharedModule } from "src/app/shared/shared.module";
import { CarouselModule } from "ngx-bootstrap/carousel";

@NgModule({
  declarations: [TeamSignupFormComponent],
  imports: [
    CommonModule,
    TeamSignupFormRoutingModule,
    SharedModule,
    CarouselModule
  ]
})
export class TeamSignupFormModule {}
