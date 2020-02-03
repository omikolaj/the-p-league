import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class HttpStatusService {
	// private validationErrorsSub$ = new Subject<ValidationError[]>();
	private validationErrorsSub$ = new Subject();
	private loadingSub$ = new ReplaySubject<boolean>(1);
	private actingSub$ = new ReplaySubject<boolean>(1);

	getValidationErrors$ = this.validationErrorsSub$.asObservable();
	loading$ = this.loadingSub$.pipe(distinctUntilChanged());
	acting$ = this.actingSub$.pipe(distinctUntilChanged());

	// set validationErrors(errors: ValidationError[]) {
	set validationErrors(errors: any) {
		this.validationErrorsSub$.next(errors);
	}

	set loading(val: boolean) {
		this.loadingSub$.next(val);
	}

	set acting(val: boolean) {
		this.actingSub$.next(val);
	}

	constructor() {}
}
