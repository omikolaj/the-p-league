import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationModule } from './components/navigation/navigation.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { StaticModule } from './static/static.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // angular
    BrowserModule,   
    BrowserAnimationsModule,
    
    // core & shared    
    NavigationModule,

    // features
    StaticModule,

    // app
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
