import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SnackBarComponent } from './snack-bar.component';

export enum SnackBarEvent {
	Success,
	Error,
	Warning
}

@Injectable({
	providedIn: 'root'
})
export class SnackBarService {
	private successConfig: MatSnackBarConfig = {
		panelClass: ['style-success'],
		horizontalPosition: 'center',
		verticalPosition: 'bottom',
		duration: 3000
	};

	private errorConfig: MatSnackBarConfig = {
		panelClass: ['style-error'],
		horizontalPosition: 'center',
		verticalPosition: 'bottom',
		duration: 5000
	};

	private warnConfig: MatSnackBarConfig = {
		panelClass: ['style-warn'],
		horizontalPosition: 'center',
		verticalPosition: 'bottom',
		duration: 5000
	};

	constructor(private snackBar: MatSnackBar) {}

	openSnackBarFromComponent(message: string, action: string, event: SnackBarEvent) {
		const data = {
			message: message,
			action: action
		};

		switch (event) {
			case SnackBarEvent.Success:
				this.successConfig.data = data;
				this.snackBar.openFromComponent(SnackBarComponent, this.successConfig);
				break;

			case SnackBarEvent.Error:
				this.errorConfig.data = data;
				this.snackBar.openFromComponent(SnackBarComponent, this.errorConfig);
				break;

			case SnackBarEvent.Warning:
				this.warnConfig.data = data;
				this.snackBar.openFromComponent(SnackBarComponent, this.warnConfig);
				break;

			default:
				break;
		}
	}
}
