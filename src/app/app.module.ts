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
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiRequestPrefixService } from "./core/interceptors/api-request-prefix/api-request-prefix.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // core & shared
    NavigationModule,
    SharedModule,

    // features
    CoreModule,

    // app
    AppRoutingModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiRequestPrefixService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
