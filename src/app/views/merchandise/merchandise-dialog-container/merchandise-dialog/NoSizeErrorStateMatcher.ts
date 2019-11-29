import { ErrorStateMatcher } from '@angular/material';

import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class NoSizeErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
		return control && control.invalid && control.touched;
	}
}
