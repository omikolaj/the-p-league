import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSortModule, MatTableModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from './components/navigation/navigation.module';
import { CoreModule } from './core/core.module';
import { ApiRequestPrefixInterceptor } from './core/interceptors/api-request-prefix/api-request-prefix.service';
import { RefreshAccessTokenInterceptor } from './core/interceptors/refresh-access-token/refresh-access-token.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		// angular
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,

		// core & shared
		SharedModule,
		CoreModule,

		// features
		NavigationModule,
		MatTableModule,
		MatSortModule,

		// app
		AppRoutingModule,
		DeviceDetectorModule.forRoot(),

		// NGXS Store
		NgxsModule.forRoot([], {
			developmentMode: true,
			selectorOptions: {
				suppressErrors: false,
				injectContainerState: false
			}
		})
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ApiRequestPrefixInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: RefreshAccessTokenInterceptor,
			multi: true
		},
		{ provide: 'BASE_API_URL', useValue: environment.backend.baseURL }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
