import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TOKEN_HEADER } from 'src/app/shared/constants/the-p-league-constants';
import { ApplicationToken } from '../../models/auth/token/ApplicationToken.model';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class RefreshAccessTokenInterceptor implements HttpInterceptor {
	private readonly refreshUrl: string = 'api/token/refresh';
	private readonly login: string = 'login';
	private refreshTokenInProgress = false;
	private refreshTokenSubject: BehaviorSubject<ApplicationToken> = new BehaviorSubject<ApplicationToken>(null);

	constructor(private authService: AuthService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError((error) => {
				// We do not want to refresh token for some requests such as login or refresh token itself.
				// So we verify url and we throw an error if it's the case
				if (req.url.includes(this.refreshUrl) || req.url.includes(this.login)) {
					// We do another check to see if refresh token failed
					// In this case we want to logout user and then re-throw the error
					if (req.url.includes(this.refreshUrl)) {
						this.authService.logout();
					}
					return throwError(error);
				}
				// If error status is different than 401 we want to skip refresh token
				// So we check that and throw the error if it's the case
				if (error.status !== 401) {
					return throwError(error);
				}
				if (this.refreshTokenInProgress) {
					// If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
					// Which means the new token is ready and we can retry the request again
					return this.refreshTokenSubject.pipe(
						filter((result) => result !== null),
						take(1),
						switchMap(() => next.handle(req))
					);
				} else {
					if (error instanceof HttpErrorResponse) {
						if (error.headers !== null) {
							if (error.headers.get(TOKEN_HEADER)) {
								this.refreshTokenInProgress = true;
								// Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been
								this.refreshTokenSubject.next(null);
								// Call authService.refreshToken(this is an observable that will be returned)
								return this.authService.refreshToken().pipe(
									switchMap((appToken: ApplicationToken) => {
										// When the call to refreshToken completes we reset the refreshTokenInProgress to false
										// For the next time the token needs to be refreshed
										this.refreshTokenInProgress = false;
										this.refreshTokenSubject.next(appToken);
										return next.handle(req);
									}),
									catchError((err) => {
										this.refreshTokenInProgress = false;
										this.authService.logout();

										return throwError(err);
									})
								);
							} else {
								return throwError(error);
							}
						}
					}
				}
			})
		);
	}
}
