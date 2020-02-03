import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpStatusService } from '../../services/http-status/http-status.service';
import { SnackBarService } from './../../../shared/components/snack-bar/snack-bar-service.service';

@Injectable({
	providedIn: 'root'
})
export class HttpStatusInterceptorService implements HttpInterceptor {
	private loadingCalls = 0;
	private actingCalls = 0;

	constructor(private httpStatusService: HttpStatusService, private snackBarService: SnackBarService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.changeStatus(true, req.method);
		return next.handle(req.clone()).pipe(
			catchError((e) => {
				// throw the error back
				// or put that in the 'HttpStatusService' as well
				// this.httpStatusService.validationErrors = e.error.validationErrors;
				return throwError(e);
			}),
			// once the request completes, errors or times out
			// change the status as well
			finalize(() => {
				this.changeStatus(false, req.method);
			})
		);
	}

	private changeStatus(val: boolean, method: string): void {
		// if the method is any of the 5 (should always be true)
		if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
			// if we are loading increment if we are not increment decrement
			val ? this.actingCalls++ : this.actingCalls--;
			// if we still have acting requests happening
			this.httpStatusService.acting = this.actingCalls > 0;
		} else if (method === 'GET') {
			val ? this.loadingCalls++ : this.loadingCalls--;
			this.httpStatusService.loading = this.loadingCalls > 0;
		}
	}
}
