import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from './core/components/navigation/navigation.module';
import { CoreModule } from './core/core.module';
import { ApiRequestPrefixInterceptor } from './core/interceptors/api-request-prefix/api-request-prefix.service';
import { HttpStatusInterceptorService } from './core/interceptors/http-status-interceptor/http-status-interceptor.service';
import { RefreshAccessTokenInterceptor } from './core/interceptors/refresh-access-token/refresh-access-token.service';
import { HttpStatusService } from './core/services/http-status/http-status.service';
import { setRootInjector } from './root-injector';
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

		// app
		AppRoutingModule,

		// NGXS Store
		NgxsModule.forRoot([], {
			developmentMode: !environment.production,
			selectorOptions: {
				suppressErrors: false,
				injectContainerState: false
			},
			compatibility: {
				strictContentSecurityPolicy: true
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
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpStatusInterceptorService,
			multi: true,
			deps: [HttpStatusService]
		},
		{ provide: 'BASE_API_URL', useValue: environment.backend.baseURL }
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(injector: Injector) {
		setRootInjector(injector);
	}
}
