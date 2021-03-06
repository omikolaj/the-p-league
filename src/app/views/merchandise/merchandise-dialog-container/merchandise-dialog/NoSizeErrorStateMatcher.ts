import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class NoSizeErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
		return control && control.invalid && control.touched;
	}
}
