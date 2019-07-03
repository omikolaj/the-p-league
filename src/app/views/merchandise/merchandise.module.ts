import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MerchandiseRoutingModule } from "./merchandise-routing.module";
import { MerchandiseListComponent } from "./merchandise-list/merchandise-list.component";
import { MerchandiseItemComponent } from "./merchandise-list/merchandise-item/merchandise-item.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "@angular/flex-layout";
import { MerchandiseDialogService } from "./merchandise-dialog-container/merchandise-dialog.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MerchandiseDialogContainerComponent } from "./merchandise-dialog-container/merchandise-dialog-container.component";
import { MerchandiseDialogComponent } from "./merchandise-dialog-container/merchandise-dialog/merchandise-dialog.component";
import { GearImageViewPipe } from "src/app/core/pipes/gear-image-view/gear-image-view.pipe";
import { IosVHDirective } from "src/app/core/directives/iosVH/ios-vh.directive";
import { HasRoleDirective } from "src/app/core/directives/has-role/has-role.directive";
import { RolesResolver } from "src/app/core/services/resolvers/roles/roles-resolver.service";
import { MerchandisePreOrderDialogComponent } from "./merchandise-dialog-container/merchandise-pre-order-dialog/merchandise-pre-order-dialog.component";
import { FilteredGearSizesPipe } from "src/app/core/pipes/filteredGearSizes/filtered-gear-sizes.pipe";

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
  entryComponents: [
    MerchandiseDialogComponent,
    MerchandisePreOrderDialogComponent
  ],
  imports: [
    CommonModule,
    MerchandiseRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    MerchandiseDialogService,
    RolesResolver,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class MerchandiseModule {}
