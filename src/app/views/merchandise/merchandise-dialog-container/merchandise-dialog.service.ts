import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchandiseDialogComponent } from './merchandise-dialog/merchandise-dialog.component';
import { MerchandisePreOrderDialogComponent } from './merchandise-pre-order-dialog/merchandise-pre-order-dialog.component';

@Injectable()
export class MerchandiseDialogService {
	component: ComponentType<MerchandiseDialogComponent | MerchandisePreOrderDialogComponent> = MerchandiseDialogComponent;

	constructor(private router: Router, private route: ActivatedRoute) {}

	openMerchandiseDialog(dialog: MatDialog): void {
		if (this.router.url.includes('pre-order')) {
			this.component = MerchandisePreOrderDialogComponent;
		} else {
			this.component = MerchandiseDialogComponent;
		}
		const dialogRef = dialog.open(this.component, {
			width: '90%',
			maxWidth: '450px'
		});

		dialogRef.afterClosed().subscribe(() => {
			this.router.navigate(['merchandise'], { relativeTo: this.route });
		});
	}
}
