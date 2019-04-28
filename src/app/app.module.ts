import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationModule } from './components/navigation/navigation.module';
import { StaticModule } from './static/static.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { MerchandiseService } from './core/services/merchandise/merchandise.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    // angular
    BrowserModule,   
    BrowserAnimationsModule,    
    ReactiveFormsModule,
    
    // core & shared    
    NavigationModule,
    SharedModule,

    // features
    StaticModule,
    CoreModule,
    
    // app
    AppRoutingModule
  ],
  providers: [
    MerchandiseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
