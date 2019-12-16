import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RolesResolver } from 'src/app/core/resolvers/roles/roles-resolver.resolver';
import { SharedModule } from 'src/app/shared/shared.module';
import { MerchandiseDialogContainerComponent } from './merchandise-dialog-container/merchandise-dialog-container.component';
import { MerchandiseDialogService } from './merchandise-dialog-container/merchandise-dialog.service';
import { MerchandiseDialogComponent } from './merchandise-dialog-container/merchandise-dialog/merchandise-dialog.component';
import { MerchandisePreOrderDialogComponent } from './merchandise-dialog-container/merchandise-pre-order-dialog/merchandise-pre-order-dialog.component';
import { MerchandiseItemComponent } from './merchandise-list/merchandise-item/merchandise-item.component';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';
import { MerchandiseRoutingModule } from './merchandise-routing.module';

@NgModule({
	declarations: [
		MerchandiseListComponent,
		MerchandiseItemComponent,
		MerchandiseDialogContainerComponent,
		MerchandiseDialogComponent,
		MerchandisePreOrderDialogComponent
	],
	entryComponents: [MerchandiseDialogComponent, MerchandisePreOrderDialogComponent],
	imports: [CommonModule, MerchandiseRoutingModule, SharedModule, ReactiveFormsModule],
	providers: [MerchandiseDialogService, RolesResolver, { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class MerchandiseModule {}
