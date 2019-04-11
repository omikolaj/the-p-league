import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationModule } from './components/navigation/navigation.module';
import { StaticModule } from './static/static.module';
import { MatInputModule, MatButtonModule, MatSelectModule, MatRadioModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // angular
    BrowserModule,   
    BrowserAnimationsModule,
    
    // core & shared    
    NavigationModule,

    // features
    StaticModule,
    CoreModule,

    // app
    AppRoutingModule,

    MatInputModule,

    MatButtonModule,

    MatSelectModule,

    MatRadioModule,

    MatCardModule,

    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
