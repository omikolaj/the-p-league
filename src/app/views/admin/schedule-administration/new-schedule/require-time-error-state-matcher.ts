import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class RequireTimeErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
		// Whenever the add game time/ remove game time event is triggered, we need
		// to update the formContol array validitity to know if we need to display
		// form validation. This seems like a good place to that validitity update
		control.updateValueAndValidity();
		return control && control.invalid && control.touched;
	}
}
