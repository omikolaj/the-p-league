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

@NgModule({
  declarations: [
    MerchandiseListComponent,
    MerchandiseItemComponent,
    MerchandiseDialogContainerComponent,
    MerchandiseDialogComponent,
    GearImageViewPipe
  ],
  entryComponents: [MerchandiseDialogComponent],
  imports: [
    CommonModule,
    MerchandiseRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    MerchandiseDialogService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class MerchandiseModule {}
