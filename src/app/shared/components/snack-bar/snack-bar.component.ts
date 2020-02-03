import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';

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
