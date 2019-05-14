import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeviceDetectorModule } from "ngx-device-detector";
import { AboutRoutingModule } from "./about-routing.module";
import { AboutComponent } from "./about.component";
import { TeamSignupFormModule } from "./components/team-signup-form/team-signup-form.module";
import { CoreModule } from "src/app/core/core.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    TeamSignupFormModule,
    CoreModule,
    SharedModule,
    DeviceDetectorModule.forRoot()
  ]
})
export class AboutModule {}
