import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GalleryRoutingModule } from "./gallery-routing.module";
import { GalleryGridListComponent } from "./gallery-grid-list.component";
import { SharedModule } from "src/app/shared/shared.module";
import { AdminControlComponent } from "./components/admin-control/admin-control.component";
import { FormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [GalleryGridListComponent, AdminControlComponent],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    SharedModule,
    FormsModule,
    DragDropModule
  ]
})
export class GalleryModule {}
