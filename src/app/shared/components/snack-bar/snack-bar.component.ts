import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatTabChangeEvent, MAT_SNACK_BAR_DATA, MatSnackBarConfig } from '@angular/material';

@Component({
	selector: 'app-snack-bar',
	templateUrl: './snack-bar.component.html',
	styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public snackBarData: any, public snackBar: MatSnackBar) {}

	ngOnInit() {}

	onDismiss() {
		this.snackBar.dismiss();
	}
}
