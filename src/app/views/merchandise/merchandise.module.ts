import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HasRoleDirective } from 'src/app/core/directives/has-role/has-role.directive';
import { IosVHDirective } from 'src/app/core/directives/iosVH/ios-vh.directive';
import { FilteredGearSizesPipe } from 'src/app/core/pipes/filteredGearSizes/filtered-gear-sizes.pipe';
import { GearImageViewPipe } from 'src/app/core/pipes/gear-image-view/gear-image-view.pipe';
import { RolesResolver } from 'src/app/core/services/resolvers/roles/roles-resolver.resolver';
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
		GearImageViewPipe,
		FilteredGearSizesPipe,
		IosVHDirective,
		HasRoleDirective,
		MerchandisePreOrderDialogComponent
	],
	entryComponents: [MerchandiseDialogComponent, MerchandisePreOrderDialogComponent],
	imports: [CommonModule, MerchandiseRoutingModule, SharedModule, ReactiveFormsModule],
	providers: [MerchandiseDialogService, RolesResolver, { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class MerchandiseModule {}
