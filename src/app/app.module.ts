import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavigationModule } from "./components/navigation/navigation.module";
import { CoreModule } from "./core/core.module";
import { MerchandiseService } from "./core/services/merchandise/merchandise.service";
import { SharedModule } from "./shared/shared.module";
import { DeviceDetectorModule } from "ngx-device-detector";

@NgModule({
  declarations: [AppComponent],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,

    // core & shared
    NavigationModule,
    SharedModule,

    // features
    CoreModule,

    // app
    AppRoutingModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [MerchandiseService],
  bootstrap: [AppComponent]
})
export class AppModule {}
